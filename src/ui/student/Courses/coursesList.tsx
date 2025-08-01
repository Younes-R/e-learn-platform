import Link from "next/link";
import styles from "./coursesList.module.css";
import { CoursesDataSegments } from "@/database/definitions";

export default function CoursesList(props: {
  CoursesDataSegments: Array<{ cid: string; title: string; description: string }>;
}) {
  return (
    // this ul should be a LIST, so if it is long, it should become scrollable.inside itself not on the whole web page.. and I guess it would be better to hide the scroll bar
    <ul className={styles.coursesList}>
      {props.CoursesDataSegments.map((course) => (
        <li
          className={styles.coursesListItem}
          key={course.cid}
        >
          <div className={styles["coursesListItem__header"]}>
            <Link href={`courses/${course.cid}`}>
              <h3>{course.title}</h3>
            </Link>
          </div>
          <p>{course.description.length < 100 ? course.description : `${course.description.substring(0, 100)}...`}</p>
        </li>
      ))}
    </ul>
  );
}
