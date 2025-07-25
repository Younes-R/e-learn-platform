import styles from "./teacherCard.module.css";
import Image from "next/image";
import Link from "next/link";

export default function TeacherCard(props: {
  teacherData: { firstName: string; lastName: string; email: string; profilePicture: string };
}) {
  return (
    <li
      key={props.teacherData.email}
      className={styles["card"]}
    >
      <figure className={styles["card__figure"]}>
        <Image
          src={`/api/media/${props.teacherData.profilePicture}`}
          alt="teacher profile picture"
          width={100}
          height={100}
        />
        <figcaption>{`${props.teacherData.firstName[0].toUpperCase()}. ${props.teacherData.lastName}`}</figcaption>
      </figure>
      <button>
        <Link href={`/common/profile/${props.teacherData.email}`}>View Account</Link>
      </button>
    </li>
  );
}
