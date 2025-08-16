import styles from "./page.module.css";
import Session from "@/ui/common/session";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getSession } from "@/database/dal/common";
import { isSessionBoughtByStudent } from "@/database/dal/student";

export default async function Page({ params }: { params: Promise<{ seid: string }> }) {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student", "teacher", "moderator", "admin"]);
  const { seid } = await params;
  const session = await getSession(seid);
  let isSessionBought = false;
  if (session) {
    try {
      isSessionBought = await isSessionBoughtByStudent(email, seid);
    } catch (err: any) {
      console.error(err.message);
      console.warn("[RSC Page Common Sessions/[seid]]: Session non-existance case avoiding mesure failed!");
    }
  }

  return (
    <main className={styles.main}>
      {session ? (
        <>
          <h2>{session.module}</h2>
          <Session
            session={session}
            isSessionBought={isSessionBought}
            role={role}
          />
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
