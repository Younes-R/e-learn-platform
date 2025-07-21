import { neon } from "@neondatabase/serverless";
import { Moderator, Student, Teacher } from "../definitions";
import { getUserId } from "./db";

const sql = neon(process.env.DATABASE_URL!);

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
    throw new Error("[getStudentsCourses]: Failed to get student courses", { cause: err.cause });
  }
}
