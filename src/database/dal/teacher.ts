import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";
import { Course } from "../definitions";

const sql = neon(process.env.DATABASE_URL!);

export async function createCourse(
  teacherEmail: string,
  course: Course,
  documents: Array<{ fileId: string; title: string }>
) {
  let courseId: string;
  try {
    const res = await sql`INSERT INTO courses(title, description, price, module, c_year, id)
      VALUES(${course.title}, ${course.description}, ${course.price}, ${course.module}, ${course.level},
      (SELECT id FROM users WHERE email = ${teacherEmail})) RETURNING cid`;
    courseId = res[0].cid;
    if (documents && documents.length > 0) {
      const query = documents.reduce((accumulator, document, idx) => {
        return (
          accumulator +
          (documents.length - 1 !== idx
            ? `('${document.fileId}', '${document.title}', '${courseId}'), `
            : `('${document.fileId}', '${document.title}', '${courseId}') RETURNING cid`)
        );
      }, `INSERT INTO documents(file_id, doc_title, cid) VALUES `);
      console.log(`[DAL createCourse]: Query: ${query}`);
      const documentsIds = await sql.query(query);
      if (documentsIds && documentsIds.length > 0) {
        return true;
      } else {
        throw new Error(
          "[DAL createCourse]: Failed to insert documents data (file_id, doc_title) into the documents table.",
          {
            cause: {
              type: "noCidsReturned",
              description: "No cids were returned after the database call.",
            },
          }
        );
      }
    } else {
      return true;
    }
  } catch (err: any) {
    if (err?.cause?.type === "noCidsReturned") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL createCourse]: Failed to create course.", { cause: err });
  }
}

export async function getPaymentsInfo(teacherEmail: string) {
  try {
    // const incomes =
    //   await sql`SELECT SUM(courses.price) AS "coursesIncome", SUM(sessions.price) AS "sessionsIncome" FROM payments JOIN courses ON payments.cid = courses.cid JOIN sessions ON payments.seid = sessions.seid WHERE status = 'paid' AND courses.id IN (SELECT id FROM users WHERE email = ${teacherEmail}) AND sessions.id IN (SELECT id FROM users WHERE email = ${teacherEmail})`;
    const coursesIncomeCountRes =
      await sql`SELECT SUM(courses.price) FROM payments JOIN courses ON payments.cid = courses.cid WHERE status = 'paid' AND courses.id IN (SELECT id FROM users WHERE email = ${teacherEmail})`;
    const sessionsIncomeCountRes =
      await sql`SELECT SUM(sessions.price) FROM payments JOIN sessions ON payments.seid = sessions.seid WHERE status = 'paid' AND sessions.id IN (SELECT id FROM users WHERE email = ${teacherEmail})`;
    const coursesIncomeRes =
      (await sql`SELECT checkout_id AS "invoice", date, first_name AS "firstName", last_name AS "lastName", title AS "course", price FROM payments JOIN users ON payments.id = users.id JOIN courses ON payments.cid = courses.cid WHERE status = 'paid' AND courses.id IN (SELECT id FROM users WHERE email =${teacherEmail}) AND type = 'teacher'`) as Array<{
        invoice: string;
        date: Date;
        firstName: string;
        lastName: string;
        course: string;
        price: number;
      }>;

    let coursesIncomeCount = 0;
    if (coursesIncomeCountRes[0].sum) {
      coursesIncomeCount = Number(coursesIncomeCountRes[0].count);
    }

    let sessionsIncomeCount = 0;
    if (sessionsIncomeCountRes[0].sum) {
      sessionsIncomeCount = Number(sessionsIncomeCountRes[0].count);
    }

    let coursesIncome = null;
    if (coursesIncomeRes && coursesIncomeRes.length > 0) {
      coursesIncome = coursesIncomeRes;
    }

    return {
      coursesIncomeCount,
      sessionsIncomeCount,
      coursesIncome,
    };
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getPaymentsInfo]: Failed to get payments info.", { cause: err });
  }
}

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
        enrolledStudentsNumber: Number(enrolledStudentsNumber?.studentsCount),
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
