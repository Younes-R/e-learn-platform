import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";

const sql = neon(process.env.DATABASE_URL!);

export async function getStudentPayments(studentEmail: string) {
  try {
    const res =
      await sql`SELECT pid AS invoice, date, status, courses.title AS course FROM payments JOIN courses ON payments.cid = courses.cid
      WHERE payments.id IN (SELECT id FROM users WHERE email = ${studentEmail})`;
    if (res && res.length > 0) {
      return res as Array<{ invoice: string; date: Date; status: string; course: string }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getStudentPayments]: Failed to get student payments.", { cause: err });
  }
}

export async function getStudentTeachers(studentEmail: string) {
  try {
    const res = await sql`SELECT first_name, last_name, email, profile_pic FROM users WHERE id IN (
    SELECT id FROM courses WHERE cid IN (
    SELECT cid FROM payments WHERE id IN (
    SELECT id FROM users WHERE email = ${studentEmail})
    AND status = 'paid'))`;
    if (res && res.length > 0) {
      return res as unknown as Array<{ first_name: string; last_name: string; email: string; profile_pic: string }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getStudentTeachers]: Failed to get student teachers.", { cause: err });
  }
}

export async function getStudentCourses(studentEmail: string) {
  let userId: string;
  try {
    userId = await getUserId(studentEmail);
  } catch (err: any) {
    console.error(err.message);
    throw new Error("[getStudentCourses]: Failed to get student courses.", { cause: err.cause });
  }

  try {
    const res = await sql`SELECT courses.cid, title, description FROM courses JOIN payments
    ON courses.cid = payments.cid WHERE
    payments.id = ${userId}`;
    if (res && res.length > 0) {
      return res as unknown as Array<{ cid: string; title: string; description: string }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getStudentsCourses]: Failed to get student courses", { cause: err });
  }
}
