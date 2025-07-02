import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Explore</h2>
      <div className={styles["sessions"]}>
        <section className={styles["session"]}>
          <h3 className={styles["session__header"]}>Sessions</h3>
          <div className={styles["session__body"]}>
            <h4 className={styles["session__body__header"]}>Language Theory</h4>
            <ul className={styles["session__body__time-info-list"]}>
              <li>Sun 04, Feb 2024</li>
              <li>10:00 - 11:00</li>
              <li>8 places remaining</li>
            </ul>
            <ul className={styles["session__body__info-list"]}>
              <li>By Dr. Zedek</li>
              <li>
                <span>Online</span>
              </li>
            </ul>
          </div>
          <div className={styles["session__body__address"]}>
            <p>Link to this session: [Insert Zoom Link]</p>
          </div>
        </section>
        <section className={styles["second-section"]}>
          <button className={styles["second-section__join"]}>Join Session</button>
          <button className={styles["second-section__undo"]}>Undo Joining</button>
        </section>
      </div>
    </main>
  );
}
