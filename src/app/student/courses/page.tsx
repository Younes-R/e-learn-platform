import Courses from "@/ui/student/Courses/courses";
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
            title: "Electronics 2",
            description:
              "This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions through the industry.",
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
