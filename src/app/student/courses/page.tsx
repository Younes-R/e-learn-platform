import CoursesList from "@/ui/student/coursesList";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Courses</h2>
      <CoursesList CoursesDataSegments={[]} />
    </main>
  );
}
