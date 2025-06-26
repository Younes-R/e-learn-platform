import styles from "./page.module.css";

import TeachersList from "@/ui/student/teachersList";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Teachers</h2>
      <TeachersList />
    </main>
  );
}
