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
      <h2>Logo</h2>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li>
            <Link href="common/explore">
              <ExploreIcon />
              Explore
            </Link>
          </li>
          <li>
            <Link href="student/courses">
              <CoursesIcon />
              Courses
            </Link>
          </li>
          <li>
            <Link href="student/schedule">
              <ScheduleIcon />
              Schedule
            </Link>
          </li>
          <li>
            <Link href="student/teachers">
              <TeachersIcon />
              Teachers
            </Link>
          </li>
          <li>
            <Link href="student/payments">
              <PaymentsIcon />
              Payments
            </Link>
          </li>
          <li>
            <Link href="student/support">
              <SupportIcon />
              Support
            </Link>
          </li>
          <li>
            <Link href="student/settings">
              <SettingsIcon />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
