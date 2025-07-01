import styles from "./page.module.css";
import Profile from "@/ui/common/profile";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Profile</h2>
      <Profile />
    </main>
  );
}
