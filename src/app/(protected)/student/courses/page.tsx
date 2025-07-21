import Courses from "@/ui/student/Courses/courses";

import styles from "./page.module.css";
import { getStudentCourses } from "@/database/dal/student";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export default async function Page() {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["student"]);
  const coursesData = await getStudentCourses(email);

  return (
    <main className={styles.main}>
      <h2>Courses</h2>
      {coursesData ? <Courses coursesDataSegments={coursesData} /> : <p>You are not enrolled in any courses.</p>}
    </main>
  );
}
