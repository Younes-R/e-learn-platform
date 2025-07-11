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
            price: 2000,
            module: "Electronics",
            level: "1CS",
            documents: [
              { title: "ererewrwer", uri: "fsdfdfdf" },
              { title: "ererewrwer", uri: "fsdfdfdf" },
              { title: "ererewrwer", uri: "fsdfdfdf" },
            ],
          },
          {
            cid: "234kjnffdsf",
            title: "Electronics 2",
            description:
              "This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions through the industry.",
            enrolledStudentsNumber: 12,
            price: 2500,
            module: "Electronics 02",
            level: "2CP",
            documents: [
              { title: "Transistors.pdf", uri: "asdsdasdsdasd" },
              { title: "Diodes.pdf", uri: "asdasdadsds" },
            ],
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
