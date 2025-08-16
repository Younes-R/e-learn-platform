import { neon } from "@neondatabase/serverless";
import { getUserId } from "./db";
import { dbSession } from "../definitions";

const sql = neon(process.env.DATABASE_URL!);

// const price = await isSessionBoughtByStudent(studentEmail, productId);
// if (price || price === 0) {
//   throw new Error(`[DAL createPaymentRecord]: Student already bought this ${productType}.`, {
//     cause: {
//       type: "productAlreadyBought",
//       description: "This product is already bought by this user. Users cannot buy the same product twice.",
//     },
//   });

export async function updatePaymentRecord(checkoutId: string, status: "paid" | "not paid") {
  try {
    const res = await sql`UPDATE payments SET status = ${status} WHERE checkout_id = ${checkoutId} RETURNING status`;
    if (res && res.length > 0) {
      return true;
    } else {
      throw new Error("[DAL updatePaymentRecord]: No payment record was updated.", {
        cause: {
          type: "noRowReturned",
          description:
            "No row was returned from the database because none had a matching checkout_url value to the value given.",
        },
      });
    }
  } catch (err: any) {
    if (err?.cause?.type === "noRowReturned") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL updatePaymentRecord]: Failed to update payment record.", { cause: err });
  }
}

export async function createPaymentRecord(
  studentEmail: string,
  productType: "course" | "session",
  productId: string,
  checkoutId: string,
  date: Date
) {
  try {
    let res;
    switch (productType) {
      case "session":
        res = await sql`INSERT INTO payments(date, checkout_id, id, seid)
          VALUES(${date}, ${checkoutId}, (SELECT id FROM users WHERE email = ${studentEmail}), ${productId})`;
        break;
      case "course":
        res = await sql`INSERT INTO payments(date, checkout_id, id, cid)
          VALUES(${date}, ${checkoutId}, (SELECT id FROM users WHERE email = ${studentEmail}), ${productId})`;
        break;
      default:
        throw new Error("[DAL createPaymentRecord]: Function was passed a wrong value as productType arg.", {
          cause: {
            type: "badArgumentType",
            description: 'productType can only has "course" or "session" as a value.',
          },
        });
        break;
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
    throw new Error("[DAL createPaymentRecord]: Failed to create payment record.", { cause: err });
  }
}

export async function isCourseBoughtByStudent(studentEmail: string, courseId: string) {
  try {
    const res = (await sql`SELECT c.cid, c.price, p.status FROM courses c LEFT JOIN payments p
      ON c.cid = p.cid AND p.id IN (SELECT id FROM users WHERE email = ${studentEmail})
      WHERE c.cid = ${courseId}`) as Array<{ seid: string; price: number; status: string | null }>;
    if (res && res.length > 0) {
      if (res[0].status === "paid") {
        return { result: true };
      } else {
        return { result: false, price: res[0].price };
      }
    } else {
      throw new Error("[DAL isCourseBoughtByStudent]: No course with the cid given.", {
        cause: {
          type: "noCourseFound",
          description: "No course is found with the cid given.",
        },
      });
    }
  } catch (err: any) {
    if (err?.cause?.type === "noCourseFound") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL isCourseBoughtByStudent]: Failed to run.", { cause: err });
  }
}

export async function isSessionBoughtByStudent(studentEmail: string, sessionId: string) {
  try {
    const res = (await sql`SELECT s.seid, s.price, p.status FROM sessions s LEFT JOIN payments p
      ON s.seid = p.seid AND p.id IN (SELECT id FROM users WHERE email = ${studentEmail})
      WHERE s.seid = ${sessionId}`) as Array<{ seid: string; price: number; status: string | null }>;
    if (res && res.length > 0) {
      if (res.find((session) => session.status === "paid")) {
        return { result: true };
      } else {
        return { result: false, price: res[0].price };
      }
    } else {
      throw new Error("[DAL isSessionBoughtByStudent]: No session with the seid given.", {
        cause: {
          type: "noSessionFound",
          description: "No session is found with the seid given.",
        },
      });
    }
  } catch (err: any) {
    if (err?.cause?.type === "noSessionFound") {
      throw err;
    }
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL isSessionBoughtByStudent]: Failed to run.", { cause: err });
  }
}

export async function getSessionsByMonth(studentEmail: string, month: { start: string; end: string }) {
  try {
    const sessions =
      await sql`SELECT sessions.seid, module, year AS level, price, type, address_link as "addressLink", day, start_time AS "startTime", end_time AS "endTime", places
      FROM sessions JOIN payments ON sessions.seid = payments.seid
      WHERE payments.id IN (SELECT id FROM users WHERE email = ${studentEmail}) AND status = 'paid' AND day BETWEEN ${month.start} AND ${month.end}`;
    return sessions as Array<dbSession>;
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[DAL getSessionsByMonth]: Failed to get sessions.", { cause: err });
  }
}

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
