import styles from "./courses.module.css";
import CoursesList from "./coursesList";

export default function Courses(props: {
  coursesDataSegments: Array<{ cid: string; title: string; description: string }>;
}) {
  return (
    <div className={styles.courses}>
      <CoursesList CoursesDataSegments={props.coursesDataSegments} />
    </div>
  );
}
