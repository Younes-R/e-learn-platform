import styles from "./paymentPanel.module.css";
import { buyProduct } from "@/actions/student";

export default function PaymentPanel(props: {
  setPanel: Function;
  resourceName: "Course" | "Session";
  resourceId: string;
}) {
  return (
    <section className={styles["section"]}>
      <div className={styles["modal"]}>
        <h3>Confirm Payment Action?</h3>
        <div>
          {/* <p>Do you want to proceed to buy this {props.resourceName.toLowerCase()}?</p> */}
          <p>You will be redirected to the Payment Service to complete your payment:</p>
        </div>
        <div className={styles["modal__actions"]}>
          <button
            onClick={() => props.setPanel(null)}
            className={styles["modal__actions__cancel"]}
          >
            Cancel
          </button>
          <button
            onClick={() => buyProduct("session", props.resourceId)}
            className={styles["modal__actions__buy"]}
          >
            Buy {props.resourceName}
          </button>
        </div>
      </div>
    </section>
  );
}
