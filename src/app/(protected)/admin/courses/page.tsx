import styles from "./page.module.css";
import Courses from "@/ui/teacher/Courses/courses";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getCourses } from "@/database/dal/admin";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["admin"]);
  const courses = await getCourses();

  return (
    <main className={styles.main}>
      <h2>Courses</h2>
      <Courses coursesDataSegments={courses} />
    </main>
  );
}
