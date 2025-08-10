import { getUsers } from "@/database/dal/admin";
import { getProfileInfo, reportUser } from "@/database/dal/common";
import { deleteUser, updateUser } from "@/database/dal/db";
import { getReports } from "@/database/dal/moderator";
import { getStudentCourses, getStudentPayments, getStudentTeachers } from "@/database/dal/student";
import { createCourse, deleteCourse, getPaymentsInfo, getTeacherCourses } from "@/database/dal/teacher";
// import { GetUserId } from "@/database/dal/db";
import { neon } from "@neondatabase/serverless";
import file from "../../../e-learn-platform.drawio-database-diagram.svg";
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
    const res = await deleteCourse("asfdf", "eab1cbb0-7549-4111-b5a5-9cfd9ca93080");
    // const res = await createCourse(
    //   "didact@gmail.com",
    //   {
    //     title: "Algebra 03",
    //     price: 2500,
    //     module: "Mathematics",
    //     level: "2CP",
    //     description: "This is a module where ...",
    //   },

    //   [
    //     { fileId: "23", title: "ch3" },
    //     { fileId: "2", title: "ch2" },
    //     { fileId: "1", title: "ch1" },
    //   ]
    // );
    // const res = await reportUser("didact@gmail.com", "librarian@gmail.com", 4, new Date());
    // const res = await updateUser("moderator@gmail.com", "moderator", {
    //   firstName: "British",
    //   lastName: "Guy",
    //   birthDate: new Date(2024, 4, 3),
    //   email: "moderator@gmail.com",
    //   phoneNumber: "1234567890",
    //   profilePicture: "",
    //   bio: "hi",
    // });
    // const res = await deleteUser("hawaii@gmail.com");
    // const res = await getUsers("moderator");
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
