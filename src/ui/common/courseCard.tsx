import styles from "./courseCard.module.css";
import Link from "next/link";

export default function CourseCard(props: {
  courseData: {
    cid: string;
    title: string;
    description: string;
    price: number;
    firstName?: string;
    lastName?: string;
  };
}) {
  return (
    <li className={styles["card"]}>
      <h4 className={styles["card__header"]}>{props.courseData.title}</h4>
      <p className={styles["card__body"]}>
        {props.courseData.description.length > 80
          ? props.courseData.description.substring(0, 80) + "..."
          : props.courseData.description}
      </p>
      <ul className={styles["card__list"]}>
        {props.courseData.firstName && props.courseData.lastName ? (
          <li>{`By ${props.courseData.firstName[0].toUpperCase()} ${
            props.courseData.lastName[0].toUpperCase() + props.courseData.lastName.substring(1)
          }`}</li>
        ) : null}
        <li>
          <span>{`${props.courseData.price} DA`}</span>
        </li>
      </ul>
      <button>
        <Link href={`/courses/${props.courseData.cid}`}>View Course</Link>
      </button>
    </li>
  );
}
