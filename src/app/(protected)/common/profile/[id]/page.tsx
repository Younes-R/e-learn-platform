import styles from "./page.module.css";
import Profile from "@/ui/common/profile";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { getProfileInfo } from "@/database/dal/common";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { email } = await verifyRefreshToken();
  console.log(`USER EMAIL (US):`, email);
  await verifyRoles(["student", "teacher", "moderator", "admin"]);
  const { id } = await params;
  console.log(`IS USER EMAIL === PROFILE EMAIL ?:`, email === id);
  console.log(`NEXT PARAMS'S ID?:`, id.replace("%40", "@"));

  // console.log(`ID:`, id);
  const profileData = await getProfileInfo(id.replace("%40", "@"));

  return (
    <main className={styles.main}>
      <h2>Profile</h2>
      <Profile
        profileInfo={profileData}
        profileEmail={id.replace("%40", "@")}
        userEmail={email}
      />
    </main>
  );
}
