import Link from "next/link";
import styles from "./coursesList.module.css";

export default function CoursesList(props: {
  CoursesDataSegments: Array<{ cid: string; title: string; description: string }>;
}) {
  return (
    // this ul should be a LIST, so if it is long, it should become scrollable.inside itself not on the whole web page.. and I guess it would be better to hide the scroll bar
    <ul className={styles.coursesList}>
      <li>
        <Link href={``}>
          <h3>Course Title</h3>
          <p>This course is for Electronics 02.</p>
        </Link>
      </li>
      <li>
        <Link href={``}>
          <h3>Course Title</h3>
          <p>This course is for Electronics 02.</p>
        </Link>
      </li>
      <li>
        <Link href={``}>
          <h3>Course Title</h3>
          <p>This course is for Electronics 02.</p>
        </Link>
      </li>
      <li>
        <Link href={``}>
          <h3>Course Title</h3>
          <p>This course is for Electronics 02.</p>
        </Link>
      </li>
    </ul>
  );
}
