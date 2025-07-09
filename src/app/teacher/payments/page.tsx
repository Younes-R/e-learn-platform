import styles from "./page.module.css";
import Payments from "@/ui/teacher/payments";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Payments</h2>
      <Payments />
    </main>
  );
}
