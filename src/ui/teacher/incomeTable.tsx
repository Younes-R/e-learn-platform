import styles from "./incomeTable.module.css";

export default function IncomeTable(props: {
  coursesIncome: Array<{
    invoice: string;
    date: Date;
    firstName: string;
    lastName: string;
    course: string;
    price: number;
  }>;
}) {
  return (
    <table className={styles.table}>
      <thead className={styles["table__head"]}>
        <tr>
          <th scope="col">Invoice</th>
          <th scope="col">Date</th>
          <th scope="col">Student</th>
          <th scope="col">Course</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody className={styles["table__body"]}>
        {props.coursesIncome.map((record) => (
          <tr className={styles["table__body__row"]}>
            <td>{record.invoice}</td>
            <td>{record.date.toDateString()}</td>
            <td>{`${record.firstName[0].toUpperCase()} ${
              record.lastName[0].toUpperCase() + record.lastName.substring(1)
            }`}</td>
            <td>{record.course[0].toUpperCase() + record.course.substring(1)}</td>
            <td>{`${record.price} DA`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
