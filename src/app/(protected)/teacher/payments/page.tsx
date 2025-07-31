import styles from "./page.module.css";
import Payments from "@/ui/teacher/payments";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getPaymentsInfo } from "@/database/dal/teacher";

export default async function Page() {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  const { coursesIncomeCount, sessionsIncomeCount, coursesIncome } = await getPaymentsInfo(email);

  return (
    <main className={styles.main}>
      <h2>Payments</h2>
      <Payments
        coursesIncomeCount={coursesIncomeCount}
        sessionsIncomeCount={sessionsIncomeCount}
        coursesIncome={coursesIncome}
      />
    </main>
  );
}
