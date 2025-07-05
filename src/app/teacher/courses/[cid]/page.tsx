import styles from "./psge.module.css";
import Course from "@/ui/teacher/course";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Course Title</h2>
      <Course />
    </main>
  );
}
