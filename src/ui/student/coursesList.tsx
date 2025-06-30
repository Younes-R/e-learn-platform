import Link from "next/link";
import styles from "./coursesList.module.css";
import { CoursesDataSegments } from "@/database/definitions";

export default function CoursesList(props: {
  CoursesDataSegments: CoursesDataSegments;
  handleClick: Function;
  selectedCourse: string | null;
}) {
  const handleClick = (cid: string) => {
    if (props.selectedCourse === cid) {
      props.handleClick(null);
    } else {
      props.handleClick(cid);
    }
  };

  return (
    // this ul should be a LIST, so if it is long, it should become scrollable.inside itself not on the whole web page.. and I guess it would be better to hide the scroll bar
    <ul className={styles.coursesList}>
      {props.CoursesDataSegments.map((course) => (
        <li
          className={` ${styles.coursesListItem} ${course.cid === props.selectedCourse ? styles.appear : ""}`}
          onClick={() => handleClick(course.cid)}
          key={course.cid}
        >
          <div className={styles["coursesListItem__header"]}>
            <Link href={`courses/${course.cid}`}>
              <h3>{course.title}</h3>
            </Link>
            {props.selectedCourse === course.cid ? (
              <div className={styles["coursesListItem__buttons"]}>
                <button className={styles["coursesListItem__buttons__edit"]}>Edit</button>
                <button className={styles["coursesListItem__buttons__delete"]}>Delete</button>
              </div>
            ) : null}
          </div>
          <p>{course.description}</p>
        </li>
      ))}
    </ul>
  );
}
