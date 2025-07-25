import styles from "./paymentsTable.module.css";

export default function PaymentsTable(props: {
  paymentsData: Array<{ invoice: string; date: Date; status: string; course: string }>;
}) {
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
        {props.paymentsData.map((record) => (
          <tr
            key={record.invoice}
            className={styles["table__body__row"]}
          >
            <td>{record.invoice}</td>
            <td>
              {(() => {
                const dateArr = record.date.toDateString().split(" ");
                return `${dateArr[1]}, ${dateArr[2]}, ${dateArr[3]}`;
              })()}
            </td>
            <td>
              <span
                className={`${
                  record.status === "paid"
                    ? styles["paid"]
                    : record.status === "pending"
                    ? styles["pending"]
                    : styles["failed"]
                } `}
              >
                {record.status}
              </span>
            </td>
            <td>{record.course}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
