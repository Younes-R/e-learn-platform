import styles from "./teacherCard.module.css";
import Image from "next/image";
import Link from "next/link";

export default function TeacherCard() {
  return (
    <li className={styles["card"]}>
      <figure className={styles["card__figure"]}>
        <Image
          src={"/720px-Main-Forerunner.png"}
          alt="teacher profile picture"
          width={100}
          height={100}
        />
        <figcaption>A. Djenadi</figcaption>
      </figure>
      <button>
        <Link href={"/common/profile/sdasds"}>View Account</Link>
      </button>
    </li>
  );
}
