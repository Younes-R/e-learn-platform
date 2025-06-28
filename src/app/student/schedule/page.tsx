import styles from "./page.module.css";
import Calendar from "@/ui/student/Calendar/calendar";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Schedule</h2>
      <Calendar />
    </main>
  );
}
