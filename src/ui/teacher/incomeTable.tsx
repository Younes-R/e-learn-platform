import styles from "./incomeTable.module.css";

export default function IncomeTable() {
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
        <tr className={styles["table__body__row"]}>
          <td>23423432</td>
          <td>Apr, 24, 2024</td>
          <td>A. Djenadi</td>
          <td>Electronics</td>
          <td>2000 DA</td>
        </tr>
        <tr className={styles["table__body__row"]}>
          <td>23423432</td>
          <td>Apr, 24, 2024</td>
          <td>L. Chelouah</td>
          <td>Algorithms</td>
          <td>1500 DA</td>
        </tr>
        <tr className={styles["table__body__row"]}>
          <td>234234</td>
          <td>Mar, 23, 2024</td>
          <td>F. Azouaou</td>
          <td>Algebra 03</td>
          <td>2500 DA</td>
        </tr>
      </tbody>
    </table>
  );
}
