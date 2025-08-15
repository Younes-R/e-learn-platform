import styles from "./page.module.css";
import SuccessIcon from "@/ui/icons/successIcon";
import Link from "next/link";

export default function Page() {
  return (
    <main className={styles.main}>
      <section className={styles["section"]}>
        <h2>Payment Successful!</h2>
        <div className={styles["icon-container"]}>
          <SuccessIcon />
        </div>
        <p>Your order is completed. You can go now to check it out!</p>
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
