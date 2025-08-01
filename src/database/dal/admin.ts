import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getCourses() {
  try {
    const coursesDataSegments =
      (await sql`SELECT cid, title, description, price, module, c_year AS level FROM courses`) as Array<{
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
    const documentsData = (await sql`SELECT doc_title AS title, file_id AS uri, cid FROM documents`) as Array<{
      title: string;
      uri: string;
      cid: string;
    }>;
    if (!(documentsData && documentsData.length > 0)) {
      console.warn("All courses have no documents!");
    }
    const enrolledStudentsCountArray =
      (await sql`SELECT courses.cid, COUNT(payments.id) AS "studentsCount" FROM courses LEFT JOIN payments ON courses.cid = payments.cid GROUP BY courses.cid`) as Array<{
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
    throw new Error("[getCourses]: Failed to get courses.", { cause: err });
  }
}

export async function getUsers(usersType: "student" | "teacher" | "moderator") {
  try {
    if (!["student", "teacher", "moderator"].includes(usersType))
      throw new Error("[getUsers]: Type error: bad type for argument 'usersType'.", {
        cause: {
          type: "badArgumentType",
          description: "The function was passed an incorrect userType (check userType type definition).",
        },
      });
    const users =
      (await sql` SELECT first_name AS "firstName", last_name AS "lastName", birth_date AS "birthDate", phone_number AS "phoneNumber", email, profile_pic AS "profilePicture", bio, address, cv, diploma FROM users WHERE type = ${usersType}`) as Array<{
        firstName: string;
        lastName: string;
        birthDate: Date;
        phoneNumber: string;
        email: string;
        profilePicture: string;
        bio: string;
        address: string;
        cv: string;
        diploma: string;
      }>;
    if (users && users.length > 0) {
      return users;
    } else {
      return null;
    }
  } catch (err: any) {
    if (err?.cause?.type === "badArgumentType") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getUsers]: Failed to get users.", { cause: err });
  }
}
