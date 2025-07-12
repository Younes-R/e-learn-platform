import styles from "./page.module.css";
import PaymentsTable from "@/ui/student/paymentsTable";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Payments</h2>
      <PaymentsTable />
    </main>
  );
}
