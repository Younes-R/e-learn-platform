import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";

const sql = neon(process.env.DATABASE_URL!);

export async function getSession(sessionId: string) {
  try {
    const sessionRes =
      await sql`SELECT s.seid,s.module, s.day, s.places - COALESCE(p."studentsCount", 0) AS "remainingPlaces",
      s.start_time AS "startTime", s.end_time AS "endTime", s.type, s.address_link AS "addressLink",
      first_name AS "firstName", last_name AS "lastName" FROM sessions s JOIN users ON s.id = users.id
      LEFT JOIN (SELECT seid, COUNT (id) as "studentsCount" FROM payments WHERE seid = ${sessionId} and status = 'paid' GROUP BY seid) p ON s.seid = p.seid WHERE s.seid = ${sessionId}`;

    if (sessionRes && sessionRes.length > 0) {
      return sessionRes[0] as {
        seid: string;
        module: string;
        day: Date;
        remainingPlaces: number;
        startTime: string;
        endTime: string;
        type: string;
        addressLink: string;
        firstName: string;
        lastName: string;
      };
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL getSession]: Failed to get session.", { cause: err });
  }
}

export async function getCourse(courseId: string) {
  let course = null;
  try {
    const courseRes =
      await sql`SELECT cid, title, description, first_name AS "firstName", last_name AS "lastName", email FROM courses
      JOIN users ON courses.id = users.id WHERE cid = ${courseId}`;
    if (courseRes && courseRes.length > 0) {
      course = courseRes[0] as {
        cid: string;
        title: string;
        description: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    } else {
      return {
        course: null,
        documents: null,
        studentsEnrolledIn: null,
      };
    }
    const documents =
      (await sql`SELECT doc_title AS "title", file_id AS "fileId" FROM documents WHERE cid = ${courseId}`) as Array<{
        title: string;
        fileId: string;
      }>;
    const studentsEnrolledIn =
      (await sql`SELECT first_name AS "firstName", last_name AS "lastName", email, profile_pic AS "profilePicture" FROM payments
      JOIN users ON payments.id = users.id WHERE cid = ${courseId} and status = 'paid'`) as Array<{
        firstName: string;
        lastName: string;
        email: string;
        profilePicture: string;
      }>;

    return {
      course,
      documents,
      studentsEnrolledIn,
    };
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL getCourse]: Failed to get course.", { cause: err });
  }
}

export async function reportUser(reporterEmail: string, reportedEmail: string, reason: number, date: Date) {
  try {
    const res = await sql`INSERT INTO reports(reporter_id, reported_id, date, reason)
    VALUES((SELECT id FROM users WHERE email = ${reporterEmail}), (SELECT id FROM users WHERE email = ${reportedEmail}), ${date}, ${reason}) RETURNING reason`;
    if (res && res.length > 0) {
      return true;
    } else {
      throw new Error("[DAL reportUser]: Failed to create a new report record.", {
        cause: {
          type: "emptyArrayReturned",
          description: "The database did not create a new row in reports table.",
        },
      });
    }
  } catch (err: any) {
    if (err?.cause?.type === "emptyArrayReturned") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL reportUser]: Failed to report user.", { cause: err });
  }
}

export async function getProfileInfo(userEmail: string) {
  try {
    const userDataRes =
      await sql`SELECT first_name AS "firstName", last_name AS "lastName", bio, type, cv, diploma, phone_number  AS "phoneNumber", profile_pic AS "profilePicture" 
      FROM users WHERE email = ${userEmail}`;
    if (!(userDataRes && userDataRes.length > 0))
      throw new Error("[getProfileInfo]: No users found with this email.", {
        cause: { type: "noUsersFound", description: "SQL function returned an empty array" },
      });
    const userData = userDataRes[0] as {
      firstName: string;
      lastName: string;
      bio: string;
      type: string;
      cv: string;
      diploma: string;
      phoneNumber: string;
      profilePicture: string;
    };

    if (userData.type !== "teacher") {
      return {
        userData,
        coursesData: null,
        coursesCount: null,
        sessionsCount: null,
      };
    }

    const coursesDataRes = await sql`SELECT cid, title, description, price FROM courses WHERE id IN
     (SELECT id FROM users WHERE email = ${userEmail}) LIMIT 5`;
    let coursesData;
    if (coursesDataRes && coursesDataRes.length > 0) {
      coursesData = coursesDataRes as Array<{ cid: string; title: string; description: string; price: number }>;
    } else {
      coursesData = null;
    }

    const coursesCountRes =
      await sql` SELECT COUNT(*) FROM courses WHERE id IN (SELECT id FROM users WHERE email =${userEmail})`;
    const coursesCount = Number(coursesCountRes[0].count);

    const sessionsCountRes =
      await sql` SELECT COUNT(*) FROM sessions WHERE id IN (SELECT id FROM users WHERE email =${userEmail})`;
    const sessionsCount = Number(sessionsCountRes[0].count);

    return {
      userData,
      coursesData,
      coursesCount,
      sessionsCount,
    };
  } catch (err: any) {
    if (err?.cause?.type === "noUsersFound") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getProfileInfo]: Failed to get profile info.", { cause: err });
  }
}

export async function getTeachers() {
  try {
    const res =
      await sql`SELECT first_name AS "firstName", last_name AS "lastName", email, profile_pic AS "profilePicture" FROM users WHERE type = 'teacher'`;
    if (res && res.length > 0) {
      return res as Array<{ firstName: string; lastName: string; email: string; profilePicture: string }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getTeachers]: Failed to get teachers.", { cause: err });
  }
}

export async function getCourses() {
  try {
    const res =
      await sql`SELECT cid, title, description, price, first_name AS firstName, last_name AS lastName FROM courses JOIN users ON courses.id = users.id`;
    if (res && res.length > 0) {
      return res as Array<{
        cid: string;
        title: string;
        description: string;
        price: number;
        firstName: string;
        lastName: string;
      }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getCourses]: Failed to get courses.", { cause: err });
  }
}

export async function getSessions() {
  try {
    const res =
      await sql`SELECT seid, module, day, start_time AS "startTime", end_time AS "endTime", sessions.type, first_name AS "firstName", last_name AS "lastName", price FROM sessions JOIN users ON sessions.id = users.id`;
    if (res && res.length > 0) {
      return res as Array<{
        seid: string;
        module: string;
        day: Date;
        startTime: string;
        endTime: string;
        type: string;
        firstName: string;
        lastName: string;
        price: number;
      }>;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getSessions]: Failed to get sessions.", { cause: err });
  }
}
