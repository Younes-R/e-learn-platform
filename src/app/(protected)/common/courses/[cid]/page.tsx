import styles from "./psge.module.css";
import Course from "@/ui/teacher/course";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getCourse } from "@/database/dal/common";

export default async function Page({ params }: { params: Promise<{ cid: string }> }) {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student", "teacher", "admin"]);

  const { cid } = await params;
  const courseData = await getCourse(cid);

  return (
    <main className={styles.main}>
      {courseData.course ? (
        <>
          <h2>{courseData.course.title[0].toUpperCase() + courseData.course.title.substring(1)}</h2>
          <Course
            courseData={courseData}
            userEmail={email}
            userRole={role}
          />
        </>
      ) : (
        <>
          <h2>Course Not Found</h2>
          <p>This course does not exist.</p>
        </>
      )}
    </main>
  );
}
