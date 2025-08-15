import styles from "./page.module.css";
import FailureIcon from "@/ui/icons/failureIcon";
import Link from "next/link";

export default function Page() {
  return (
    <main className={styles.main}>
      <section className={styles["section"]}>
        <h2>Payment Failed!</h2>
        <div className={styles["icon-container"]}>
          <FailureIcon />
        </div>
        <p>Your order is cancelled. You still can re-order again later!</p>
        <Link
          className={styles["section__action"]}
          href={"/student"}
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
