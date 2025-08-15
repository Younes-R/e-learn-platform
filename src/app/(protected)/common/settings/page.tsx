import styles from "./page.module.css";
import Settings from "@/ui/common/settings";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["student", "teacher", "moderator", "admin"]);

  return (
    <main className={styles.main}>
      <h2>Settigns Page</h2>
      <Settings />
    </main>
  );
}
