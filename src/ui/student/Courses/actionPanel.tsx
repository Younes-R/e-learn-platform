import styles from "./actionPanel.module.css";

export default function ActionPanel(props: { courseName: string; setIsForm: Function }) {
  return (
    <section className={styles["action-panel"]}>
      <div className={styles["action-panel__modal"]}>
        <h3>Delete This Course?</h3>
        <p>Are you sure you want to delete this course '{props.courseName}' ?</p>
        <div className={styles["action-panel__modal__actions"]}>
          <button
            onClick={() => props.setIsForm(null)}
            className={styles["action-panel__modal__actions__cancel"]}
          >
            Cancel
          </button>
          <button className={styles["action-panel__modal__actions__delete"]}>Delete</button>
        </div>
      </div>
    </section>
  );
}
