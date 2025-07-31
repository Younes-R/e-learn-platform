import styles from "./payments.module.css";
import IncomeTable from "./incomeTable";

export default function Payments(props: {
  coursesIncomeCount: number;
  sessionsIncomeCount: number;
  coursesIncome: Array<{
    invoice: string;
    date: Date;
    firstName: string;
    lastName: string;
    course: string;
    price: number;
  }> | null;
}) {
  return (
    <div className={styles["payments"]}>
      <section className={styles["stats"]}>
        <div>
          <h4>From Courses:</h4>
          <span className={styles["stats__first-span"]}>{` ${props.coursesIncomeCount} DA`}</span>
        </div>
        <div>
          <h4>From Sessions:</h4>
          <span className={styles["stats__second-span"]}>{`${props.sessionsIncomeCount} DA`}</span>
        </div>
        <div>
          <h4>Total:</h4>
          <span>{`${props.coursesIncomeCount + props.sessionsIncomeCount} DA`}</span>
        </div>
      </section>
      <section className={styles["income"]}>
        <h3>Courses Income</h3>
        {props.coursesIncome ? (
          <IncomeTable coursesIncome={props.coursesIncome} />
        ) : (
          <p>No payments records to show.</p>
        )}
      </section>
    </div>
  );
}
