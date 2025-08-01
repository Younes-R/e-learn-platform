import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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
