import styles from "./sessionCard.module.css";
import Link from "next/link";

export default function SessionCard(props: {
  sessionData: {
    seid: string;
    module: string;
    day: Date;
    startTime: string;
    endTime: string;
    type: string;
    firstName: string;
    lastName: string;
    price: number;
  };
}) {
  return (
    <li className={styles["card"]}>
      <h4 className={styles["card__header"]}>Language Theory</h4>
      <ul className={styles["card__time-info-list"]}>
        <li>Sun 04, Feb 2024</li>
        <li>10:00 - 11:00</li>
        <li>
          <span>Online</span>
        </li>
      </ul>
      <ul className={styles["card__info-list"]}>
        <li>By Dr. Zedek</li>
        <li>
          <span>200DA</span>
        </li>
      </ul>
      <button>
        <Link href={"explore/sessions/dsads"}>View Session</Link>
      </button>
    </li>
  );
}
