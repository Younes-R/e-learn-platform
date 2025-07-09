import styles from "./payments.module.css";
import IncomeTable from "./incomeTable";

export default function Payments() {
  return (
    <div className={styles["payments"]}>
      <section className={styles["stats"]}>
        <div>
          <h4>From Courses:</h4>
          <span className={styles["stats__first-span"]}> 13000 DA</span>
        </div>
        <div>
          <h4>From Sessions:</h4>
          <span className={styles["stats__second-span"]}>17000 DA</span>
        </div>
        <div>
          <h4>Total:</h4>
          <span>30000DA</span>
        </div>
      </section>
      <section className={styles["income"]}>
        <h3>Course Income</h3>
        <IncomeTable />
      </section>
    </div>
  );
}
