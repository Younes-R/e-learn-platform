import styles from "./explore.module.css";
import CourseCard from "./courseCard";
import TeacherCard from "./teacherCard";
import SessionCard from "./sessionCard";

export default function Explore() {
  return (
    <div className={styles["explore"]}>
      <section className={styles["teachers"]}>
        <h3 className={styles["teachers__header"]}>Teachers</h3>
        <ul className={styles["teachers__list"]}>
          <TeacherCard />
          <TeacherCard />
          <TeacherCard />
        </ul>
      </section>
      <section className={styles["courses"]}>
        <h3 className={styles["courses__header"]}>Courses</h3>
        <ul className={styles["courses__list"]}>
          <CourseCard />
          <CourseCard />
        </ul>
      </section>
      <section className={styles["sessions"]}>
        <h3 className={styles["sessions__header"]}>Sessions</h3>
        <ul className={styles["sessions__list"]}>
          <SessionCard />
          <SessionCard />
          <SessionCard />
        </ul>
      </section>
    </div>
  );
}
