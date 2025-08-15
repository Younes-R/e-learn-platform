import styles from "./logOutPanel.module.css";
import { logOut } from "@/actions/auth";

export default function LogOutPanel(props: { setPanel: Function }) {
  return (
    <section className={styles["section"]}>
      <div className={styles["modal"]}>
        <h3>Log Out?</h3>
        <p>Are you sure you want to log out from this account?</p>
        <div className={styles["modal__actions"]}>
          <button
            onClick={() => props.setPanel(null)}
            className={styles["modal__actions__cancel"]}
          >
            Cancel
          </button>
          <button
            onClick={() => logOut()}
            className={styles["modal__actions__log-out"]}
          >
            Log Out
          </button>
        </div>
      </div>
    </section>
  );
}
