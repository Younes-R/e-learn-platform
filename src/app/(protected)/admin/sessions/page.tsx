import styles from "./page.module.css";
import Sessions from "@/ui/admin/sessions";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getSessions } from "@/database/dal/admin";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  const sessions = await getSessions();

  return (
    <main className={styles.main}>
      <h2>Sessions</h2>
      <Sessions sessionsData={sessions} />
    </main>
  );
}
