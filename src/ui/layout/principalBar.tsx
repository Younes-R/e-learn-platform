import Link from "next/link";
import styles from "./principalBar.module.css";
import ExploreIcon from "../icons/exploreIcon";
import CoursesIcon from "../icons/coursesIcon";
import ScheduleIcon from "../icons/scheduleIcon";
import TeachersIcon from "../icons/teachersIcon";
import PaymentsIcon from "../icons/paymentsIcon";
import SupportIcon from "../icons/supportIcon";
import SettingsIcon from "../icons/settingsIcon";

export default function PrincipalBar() {
  return (
    <aside className={styles.aside}>
      <h2>
        <span>Logo</span>
      </h2>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li>
            <Link href="/common/explore">
              <ExploreIcon />
              <span>Explore</span>
            </Link>
          </li>
          <li>
            <Link href="/student/courses">
              <CoursesIcon />
              <span>Courses</span>
            </Link>
          </li>
          <li>
            <Link href="/student/schedule">
              <ScheduleIcon />
              <span>Schedule</span>
            </Link>
          </li>
          <li>
            <Link href="/student/teachers">
              <TeachersIcon />
              <span>Teachers</span>
            </Link>
          </li>
          <li>
            <Link href="/student/payments">
              <PaymentsIcon />
              <span>Payments</span>
            </Link>
          </li>
          <li>
            <Link href="/common/support">
              <SupportIcon />
              <span>Support</span>
            </Link>
          </li>
          <li>
            <Link href="/common/settings">
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
