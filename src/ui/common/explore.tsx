import styles from "./explore.module.css";
import CourseCard from "./courseCard";
import TeacherCard from "./teacherCard";
import SessionCard from "./sessionCard";

export default function Explore(props: {
  teachersData: Array<{ firstName: string; lastName: string; email: string; profilePicture: string }> | null;
  coursesData: Array<{
    cid: string;
    title: string;
    description: string;
    price: number;
    firstName: string;
    lastName: string;
  }> | null;
  sessionsData: Array<{
    seid: string;
    module: string;
    day: Date;
    startTime: string;
    endTime: string;
    type: string;
    firstName: string;
    lastName: string;
    price: number;
  }> | null;
}) {
  return (
    <div className={styles["explore"]}>
      <section className={styles["teachers"]}>
        <h3 className={styles["teachers__header"]}>Teachers</h3>
        {props.teachersData ? (
          <ul className={styles["teachers__list"]}>
            {props.teachersData.map((teacher) => (
              <TeacherCard
                key={teacher.email}
                teacherData={teacher}
              />
            ))}
          </ul>
        ) : (
          <p>Could not display teachers.</p>
        )}
      </section>
      <section className={styles["courses"]}>
        <h3 className={styles["courses__header"]}>Courses</h3>
        {props.coursesData ? (
          <ul className={styles["courses__list"]}>
            {props.coursesData.map((course) => (
              <CourseCard courseData={course} />
            ))}
          </ul>
        ) : (
          <p>Could not display courses.</p>
        )}
      </section>
      <section className={styles["sessions"]}>
        <h3 className={styles["sessions__header"]}>Sessions</h3>
        {props.sessionsData ? (
          <ul className={styles["sessions__list"]}>
            {props.sessionsData.map((session) => (
              <SessionCard sessionData={session} />
            ))}
          </ul>
        ) : (
          <p>Could not display sessions.</p>
        )}
      </section>
    </div>
  );
}
