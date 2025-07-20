import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jwt from "jsonwebtoken";

export async function verifyRefreshToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    console.error("No refreshToken found.");
    redirect("/login");
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
    console.log("verifyRT:", payload);
    return payload;
  } catch (error: any) {
    console.error(error.message);
    redirect("/login");
  }
}

export async function verifyRoles(roles: Array<"student" | "teacher" | "moderator" | "admin">) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    console.error("No refreshToken found.");
    redirect("/login");
  }
  let payload: any;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (error: any) {
    console.error(error.message);
    redirect("/login");
  }
  console.log("PAYLOAD ROLE:", payload.role);
  if (!roles.includes(payload.role)) {
    console.error("User has not access to this page.");
    console.log(payload);
    redirect(`/${payload.role}`);
  }
}
