import Courses from "@/ui/student/courses";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Courses</h2>
      <Courses
        coursesDataSegments={[
          {
            cid: "1232lknasd",
            title: "Course Title",
            description: "This course is for Electronics 02.",
            enrolledStudentsNumber: 34,
          },
          {
            cid: "234kjnffdsf",
            title: "Course Title",
            description: "This course is for Electronics 02.",
            enrolledStudentsNumber: 12,
          },
          {
            cid: "546809402woend",
            title: "Course Title",
            description: "This course is for Electronics 02.",
            enrolledStudentsNumber: 14,
          },
          {
            cid: "978mvsdvfv",
            title: "Course Title",
            description: "This course is for Electronics 02.",
            enrolledStudentsNumber: 24,
          },
        ]}
      />
    </main>
  );
}
