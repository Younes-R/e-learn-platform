import styles from "./teachersList.module.css";
import Link from "next/link";
import Avatar from "../avatar";

export default function TeachersList() {
  return (
    <ul className={styles.teachersList}>
      <li>
        <Avatar /> Teacher 1
      </li>
      <li>
        <Avatar /> Teacher 2
      </li>
      <li>
        <Avatar /> Teacher 3
      </li>
      <li>
        <Avatar /> Teacher 4
      </li>
    </ul>
  );
}
