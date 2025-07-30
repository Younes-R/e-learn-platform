import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";

const sql = neon(process.env.DATABASE_URL!);

//  cid: string;
//     title: string;
//     description: string;
//     enrolledStudentsNumber: number;
//     price?: number;
//     module?: string;
//     level?: string;
//     documents?: Array<{ title: string; uri: string }>; // we should fix types later

export async function getTeacherCourses(teacherEmail: string) {
  try {
    const coursesDataSegments =
      (await sql`SELECT cid, title, description, price, module, c_year AS level FROM courses WHERE id IN (SELECT id FROM users WHERE email = ${teacherEmail})`) as Array<{
        cid: string;
        title: string;
        description: string;
        price: number;
        module: string;
        level: string;
      }>;
    if (!(coursesDataSegments && coursesDataSegments.length > 0)) {
      return null;
    }
    const documentsData =
      (await sql`SELECT doc_title AS title, file_id AS uri, cid FROM documents WHERE cid IN (SELECT cid FROM courses WHERE id IN (SELECT id FROM users WHERE email = ${teacherEmail}))`) as Array<{
        title: string;
        uri: string;
        cid: string;
      }>;
    if (!(documentsData && documentsData.length > 0)) {
      console.warn("All courses by this teacher have no documents!");
    }
    const enrolledStudentsCountArray =
      (await sql`SELECT courses.cid, COUNT(payments.id) AS "studentsCount" FROM courses LEFT JOIN payments ON courses.cid = payments.cid WHERE courses.id IN (SELECT id FROM users WHERE email = ${teacherEmail}) GROUP BY courses.cid`) as Array<{
        cid: string;
        studentsCount: string;
      }>;

    const coursesData = coursesDataSegments.map((course) => {
      const documents = documentsData.filter((document) => document.cid === course.cid);
      const enrolledStudentsNumber = enrolledStudentsCountArray.find((record) => record.cid === course.cid);
      return {
        ...course,
        documents: documents,
        enrolledStudentsNumber: enrolledStudentsNumber?.studentsCount as unknown as number,
      };
    });

    return coursesData;
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getTeacherCourses]: Failed to get teacher courses.", { cause: err });
  }
}
