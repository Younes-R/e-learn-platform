import { table } from "console";
import styles from "./paymentsTable.module.css";

export default function PaymentsTable() {
  return (
    <table className={styles.table}>
      <thead className={styles["table__head"]}>
        <tr>
          <th scope="col">Invoice</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">Course</th>
        </tr>
      </thead>
      <tbody className={styles["table__body"]}>
        <tr className={styles["table__body__row"]}>
          <td>23423432</td>
          <td>Apr, 24, 2024</td>
          <td>
            <span>Paid</span>
          </td>
          <td>Electronics</td>
        </tr>
        <tr className={styles["table__body__row"]}>
          <td>23423432</td>
          <td>Apr, 24, 2024</td>
          <td>
            <span>Pending</span>
          </td>
          <td>Algorithms</td>
        </tr>
        <tr className={styles["table__body__row"]}>
          <td>234234</td>
          <td>Mar, 23, 2024</td>
          <td>
            <span>Cancelled</span>
          </td>
          <td>Algebra 03</td>
        </tr>
      </tbody>
    </table>
  );
}
