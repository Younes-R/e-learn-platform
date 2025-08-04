import styles from "./page.module.css";
import Reports from "@/ui/moderator/reports";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getReports } from "@/database/dal/moderator";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["moderator"]);
  const reports = await getReports();

  return (
    <main className={styles.main}>
      <h2>Reports</h2>
      <Reports reports={reports} />
    </main>
  );
}
