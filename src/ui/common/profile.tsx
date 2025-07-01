import styles from "./profile.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
  return (
    <div className={styles.profile}>
      <div className={styles["first-section"]}>
        <section className={styles["intro"]}>
          {/* <h3 className={styles["intro__header"]}>Profile Name</h3> */}
          <div className={styles["intro__body"]}>
            <figure className={styles["intro__body__figure"]}>
              <Image
                src={"/720px-Main-Forerunner.png"}
                alt="Profile Picture"
                width={160}
                height={160}
              />
              <figcaption>Teacher</figcaption>
            </figure>
            <div className={styles["intro__body__main"]}>
              <p>
                {" "}
                Welcome ! I am Dr. Ali Djenadi. I am currently a teacher on ESTIN “Ecole Nationale supérieure en
                Sciences et Technologies de l'Informatique ”, and before on A. Mira University at Bejaia. I have A
                Doctorat on Electronics, the module I am currently responsible for on ESTIN.
              </p>
              <ul className={styles["intro__body__main__list"]}>
                <li>Courses: 23</li>
                <li>Sessions: 56</li>
              </ul>
            </div>
          </div>
        </section>
        <section className={styles["courses"]}>
          <div className={styles["courses__header"]}>
            <h3>Courses</h3>
            <Link href={"/student/courses"}>See All</Link>
            {/* so /courses?teacher=teacherName, right ? it should be like this */}
          </div>
          <ul className={styles["courses__list"]}>
            <li className={styles["card"]}>
              <h4 className={styles["card__header"]}>Electronics 02</h4>
              <p className={styles["card__body"]}>
                This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions....
              </p>
              <ul className={styles["card__list"]}>
                <li>By Dr. Djenadi</li>
                <li>
                  <span>2000 DA</span>
                </li>
              </ul>
              <button>
                <Link href={"/courses/sdad"}>View Course</Link>
              </button>
            </li>
            <li className={styles["card"]}>
              <h4 className={styles["card__header"]}>Electronics 02</h4>
              <p className={styles["card__body"]}>
                This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions....
              </p>
              <ul className={styles["card__list"]}>
                <li>By Dr. Djenadi</li>
                <li>
                  <span>2000 DA</span>
                </li>
              </ul>
              <button>
                <Link href={"/courses/sdad"}>View Course</Link>
              </button>
            </li>
          </ul>
        </section>
      </div>
      <div className={styles["second-section"]}>
        <div className={styles["academic-info"]}>
          <h3>Academic Info</h3>
          <p>CV: </p>
        </div>
        <div className={styles["contacts-info"]}>
          <h3>Contacts Info</h3>
          <ul>
            <li>Phone Number:</li>
            <li>Email:</li>
          </ul>
        </div>
        <button className={styles["report-button"]}>Report Account</button>
      </div>
    </div>
  );
}
