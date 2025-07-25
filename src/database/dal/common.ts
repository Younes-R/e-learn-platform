import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";

const sql = neon(process.env.DATABASE_URL!);

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
      await sql`SELECT seid, module, day, start_time AS startTime, end_time AS endTime, sessions.type, first_name AS firstName, last_name AS lastName, price FROM sessions JOIN users ON sessions.id = users.id`;
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
