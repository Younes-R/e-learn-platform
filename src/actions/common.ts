"use server";
import { verifyRefreshToken } from "@/lib/utils";
import { reportUser as dbReportUser } from "@/database/dal/common";

export async function reportUser(reportedEmail: string, date: Date, reason: number) {
  const { email } = await verifyRefreshToken();
  if (!reason) {
    return "Choose an option first";
  }
  try {
    const res = await dbReportUser(email, reportedEmail, reason, date);
    console.log("User reported successfully!");
  } catch (err: any) {
    console.error(err.message);
    return "Failed to report user. Try again!";
  }
}
