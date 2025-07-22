import styles from "./page.module.css";
import Calendar from "@/ui/student/Calendar/calendar";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export default async function Page() {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student"]);

  return (
    <main className={styles.main}>
      <h2>Schedule</h2>
      <Calendar userRole={role} />
    </main>
  );
}
