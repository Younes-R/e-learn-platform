import styles from "./page.module.css";
import Courses from "@/ui/teacher/Courses/courses";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getTeacherCourses } from "@/database/dal/teacher";

export default async function Page() {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  const coursesData = await getTeacherCourses(email);

  return (
    <main className={styles.main}>
      <h2>Courses</h2>
      <Courses coursesDataSegments={coursesData} />
    </main>
  );
}
