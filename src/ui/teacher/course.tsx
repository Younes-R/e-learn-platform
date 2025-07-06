import styles from "./course.module.css";
import Avatar from "../avatar";

export default function Course() {
  return (
    <div className={styles["course"]}>
      <section className={styles["first-section"]}>
        <div className={styles["first-part"]}>
          <div className={styles["first-part__div"]}>
            <p>
              This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions
              through the industry.
            </p>
            <ul>
              <li>By Dr. Djenadi</li>
              <li>280 students enrolled in</li>
            </ul>
          </div>
        </div>
        <div className={styles["documents"]}>
          <h2>Documents</h2>
          <ul>
            <li>
              <span>Doc 1</span>
            </li>
            <li>
              <span>Doc 2</span>
            </li>
            <li>
              <span>Doc 3</span>
            </li>
            <li>
              <span>Doc 4</span>
            </li>
          </ul>
        </div>
        <div className={styles["students"]}>
          <h2>Students Enrolled In</h2>
          <ul className={styles["students__list"]}>
            <li className={styles["students__list__item"]}>
              <Avatar />
              A. Djenadi
            </li>
            <li className={styles["students__list__item"]}>
              <Avatar />
              S. Benslimane
            </li>
            <li className={styles["students__list__item"]}>
              <Avatar />
              F. Azouaou
            </li>
          </ul>
        </div>
      </section>
      <section className={styles["second-section"]}>
        <button className={styles["edit"]}>Edit Course</button>
        <button className={styles["delete"]}>Delete Course</button>
      </section>
    </div>
  );
}
