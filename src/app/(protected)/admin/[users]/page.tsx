import styles from "./page.module.css";
import Users from "@/ui/admin/users";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getUsers } from "@/database/dal/admin";

// users: 'students' | 'teachers' | 'moderators' it should be like that
export default async function Page({ params }: { params: Promise<{ users: "students" | "teachers" | "moderators" }> }) {
  await verifyRefreshToken();
  await verifyRoles(["admin"]);

  const { users } = await params;
  const usersType =
    users === "students" ? "student" : users === "teachers" ? "teacher" : users === "moderators" ? "moderator" : "";

  if (!["student", "teacher", "moderator"].includes(usersType))
    throw new Error("[Admin Users Page]: bad query param.", {
      cause: {
        type: "badQueryParamType",
        description: "The RSC page was passed an incorrect users queryparam.",
      },
    });

  const usersData = await getUsers(usersType as "student" | "teacher" | "moderator");

  return (
    <main className={styles.main}>
      <h2>{users.charAt(0).toUpperCase() + users.slice(1)}</h2>

      <Users
        usersType={users}
        users={usersData}
      />
    </main>
  );
}
