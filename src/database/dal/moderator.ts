import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getReports() {
  try {
    const reports =
      (await sql`SELECT reporter.first_name AS "reporterFirstName", reporter.last_name AS "reporterLastName", reporter.email AS "reporterEmail", reported.first_name AS "reportedFirstName", reported.last_name AS "reportedLastName", reported.email AS "reportedEmail", date, reason FROM reports JOIN users AS reporter ON reports.reporter_id = reporter.id JOIN users AS reported ON reports.reported_id = reported.id WHERE action = 'pending' ORDER BY reports.date DESC`) as Array<{
        reporterFirstName: string;
        reporterLastName: string;
        reporterEmail: string;
        reportedFirstName: string;
        reportedLastName: string;
        reportedEmail: string;
        date: Date;
        reason: number;
      }>;

    if (reports && reports.length > 0) {
      return reports;
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(`[Database error]: 
      msg: ${err.message}
      routine: ${err.routine}
      hint: ${err.hint}
    `);
    throw new Error("[getReports]: Failed to get reports", { cause: err });
  }
}
