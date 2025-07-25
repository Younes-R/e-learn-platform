import styles from "./page.module.css";
import TeachersList from "@/ui/student/teachersList";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getStudentTeachers } from "@/database/dal/student";

export default async function Page() {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["student"]);
  const usersData = await getStudentTeachers(email);

  return (
    <main className={styles.main}>
      <h2>Teachers</h2>
      {usersData ? <TeachersList usersData={usersData} /> : <p>No users found to display.</p>}
    </main>
  );
}
