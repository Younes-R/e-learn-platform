import { getUsers } from "@/database/dal/admin";
import { getProfileInfo } from "@/database/dal/common";
import { getReports } from "@/database/dal/moderator";
import { getStudentCourses, getStudentPayments, getStudentTeachers } from "@/database/dal/student";
import { getPaymentsInfo, getTeacherCourses } from "@/database/dal/teacher";
// import { GetUserId } from "@/database/dal/db";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  //   try {
  //     const res = await sql`SELCT first_name, last_name, email, birth_date FROM users WHERE email = '';`;
  //     console.log(res);
  //     return Response.json({ result: res });
  //   } catch (err: any) {
  //     console.error(err.message);
  //     console.error(err.routine);
  //     console.error(err.hint);
  //     return Response.json({ err: err, err_msg: err.message });
  //   }

  try {
    const res = await getUsers("moderator");
    // const res = await getReports();
    // const res = await getPaymentsInfo("librarian@gmail.com");
    // const res =
    //   await sql`SELECT SUM(sessions.price) FROM payments JOIN sessions ON payments.seid = sessions.seid WHERE status = 'paid' AND sessions.id IN (SELECT id FROM users WHERE email = 'ur-didact@gmail.com')`;
    // const res = await getTeacherCourses("");
    // const res = await getProfileInfo("librarian@gmail.com");
    console.log(res);
    // const res = await getStudentPayments("");

    // const res = await getStudentCourses("librarian@gmail.com");
    // const res = await getStudentTeachers("");
    // const res = await getUserbyEmail("librarian@gmail.com");
    if (res) {
      return Response.json(res);
    } else {
      return Response.json({ msg: "nothing returned" });
    }
  } catch (err: any) {
    console.error(err.message);
    // console.error("ERROR CAUSE:");
    // console.error(err.cause);

    return Response.json({ err_msg: "Something wrong happened. Try again later!", err_cause: err.cause });
  }
}

async function getUserbyEmail(email: string) {
  try {
    const res = await sql`SELECT first_name, last_name, email, birth_date FROM users WHERE email = ${email}`;
    if (res && res.length > 0) {
      return res[0] as { first_name: string; last_name: string; email: string; birth_date: Date };
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getUserByEmail]: Failed to get user by email.", { cause: err });
  }
}
