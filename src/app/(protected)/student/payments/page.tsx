import styles from "./page.module.css";
import PaymentsTable from "@/ui/student/paymentsTable";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getStudentPayments } from "@/database/dal/student";

export default async function Page() {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["student"]);
  const paymentsData = await getStudentPayments(email);

  return (
    <main className={styles.main}>
      <h2>Payments</h2>
      {paymentsData ? (
        <PaymentsTable paymentsData={paymentsData} />
      ) : (
        <p>You did not purchase any course or session.</p>
      )}
    </main>
  );
}
