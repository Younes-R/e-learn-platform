import styles from "./courseCard.module.css";
import Link from "next/link";

export default function CourseCard() {
  return (
    <li className={styles["card"]}>
      <h4 className={styles["card__header"]}>Electronics 02</h4>
      <p className={styles["card__body"]}>
        This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions....
      </p>
      <ul className={styles["card__list"]}>
        <li>By Dr. Djenadi</li>
        <li>
          <span>2000 DA</span>
        </li>
      </ul>
      <button>
        <Link href={"/courses/sdad"}>View Course</Link>
      </button>
    </li>
  );
}
