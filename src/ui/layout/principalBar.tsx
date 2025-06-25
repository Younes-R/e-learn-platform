import Link from "next/link";
import styles from "./principalBar.module.css";

export default function PrincipalBar() {
  return (
    <aside className={styles.aside}>
      <h2>Logo</h2>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li>
            <Link href="common/explore">Explore</Link>
          </li>
          <li>
            <Link href="student/courses">Courses</Link>
          </li>
          <li>
            <Link href="student/schedule">Schedule</Link>
          </li>
          <li>
            <Link href="student/teachers">Teachers</Link>
          </li>
          <li>
            <Link href="student/payments">Payments</Link>
          </li>
          <li>
            <Link href="student/support">Support</Link>
          </li>
          <li>
            <Link href="student/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
