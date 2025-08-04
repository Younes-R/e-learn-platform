import styles from "./page.module.css";
import Explore from "@/ui/common/explore";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getTeachers, getCourses, getSessions } from "@/database/dal/common";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["student", "teacher", "moderator"]);
  const teachersData = await getTeachers();
  const coursesData = await getCourses();
  const sessionsData = await getSessions();
  // const { a, b, c } = await Promise.all([getTeachers, getCourses, getSessions]);

  return (
    <main className={styles.main}>
      <h2>Explore Page</h2>
      <Explore
        teachersData={teachersData}
        coursesData={coursesData}
        sessionsData={sessionsData}
      />
    </main>
  );
}
