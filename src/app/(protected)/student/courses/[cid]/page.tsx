import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <section className={styles["first-section"]}>
        <h2>Course Title</h2>
        <div className={styles["first-section__div"]}>
          <p>
            This Course is for Electronics 2. It is about transistors and their types, behaviors and evolutions through
            the industry.
          </p>
          <ul>
            <li>By Dr. Djenadi</li>
            <li>280 students enrolled in</li>
          </ul>
        </div>
      </section>
      <section className={styles["second-section"]}>
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
      </section>
    </main>
  );
}
