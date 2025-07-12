import styles from "./page.module.css";
import Explore from "@/ui/common/explore";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Explore Page</h2>
      <Explore />
    </main>
  );
}
