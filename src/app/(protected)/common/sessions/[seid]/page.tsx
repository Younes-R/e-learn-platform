import styles from "./page.module.css";
import Session from "@/ui/common/session";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getSession } from "@/database/dal/common";

export default async function Page({ params }: { params: Promise<{ seid: string }> }) {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student", "teacher", "moderator", "admin"]);
  const { seid } = await params;
  const session = await getSession(seid);

  return (
    <main className={styles.main}>
      {session ? (
        <>
          <h2>{session.module}</h2>
          <Session session={session} />
        </>
      ) : (
        <>
          <h2>Session Not Found</h2>
          <p>This session does not exist.</p>
        </>
      )}
    </main>
  );
}
