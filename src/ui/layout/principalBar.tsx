import Link from "next/link";
import styles from "./principalBar.module.css";
import ExploreIcon from "../icons/exploreIcon";
import CoursesIcon from "../icons/coursesIcon";
import ScheduleIcon from "../icons/scheduleIcon";
import TeachersIcon from "../icons/teachersIcon";
import PaymentsIcon from "../icons/paymentsIcon";
import SupportIcon from "../icons/supportIcon";
import DashboardIcon from "../icons/dashboardIcon";
import ModeratorsIcon from "../icons/moderatorsIcon";
import StudentsIcon from "../icons/studentsIcon";
import SessionsIcon from "../icons/sessionsIcon";

import SettingsIcon from "../icons/settingsIcon";
import { verifyRefreshToken } from "@/lib/utils";

export default async function PrincipalBar() {
  const { role } = await verifyRefreshToken();

  if (!["moderator", "admin"].includes(role)) {
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
              <Link href={`/${role}/courses`}>
                <CoursesIcon />
                <span>Courses</span>
              </Link>
            </li>
            <li>
              <Link href={`/${role}/schedule`}>
                <ScheduleIcon />
                <span>Schedule</span>
              </Link>
            </li>
            {role === "student" ? (
              <li>
                <Link href="/student/teachers">
                  <TeachersIcon />
                  <span>Teachers</span>
                </Link>
              </li>
            ) : null}
            <li>
              <Link href={`/${role}/payments`}>
                <PaymentsIcon />
                <span>Payments</span>
              </Link>
            </li>
            <li className={styles["support-list-item"]}>
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

  if (role === "moderator") {
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
              <Link href="/moderator">
                <span>Reports</span>
              </Link>
            </li>

            <li className={styles["support-list-item"]}>
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
  if (role === "admin") {
    return (
      <aside className={styles.aside}>
        <h2>
          <span>Logo</span>
        </h2>
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            <li>
              <Link href="/admin/">
                <DashboardIcon />
                <span>DashBoard</span>
              </Link>
            </li>
            <li className={styles["group-first-list-item"]}>
              <Link href="/admin/moderators">
                <ModeratorsIcon />
                <span>Moderators</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/teachers">
                <TeachersIcon />
                <span>Teachers</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/students">
                <StudentsIcon />
                <span>Students</span>
              </Link>
            </li>
            <li className={styles["group-first-list-item"]}>
              <Link href="/admin/courses">
                <CoursesIcon />
                <span>Courses</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/sessions">
                <SessionsIcon />
                <span>Sessions</span>
              </Link>
            </li>

            <li className={styles["support-list-item"]}>
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
}
