import styles from "./deletePanel.module.css";

export default function DeletePanel(props: {
  resourceType: "User" | "Course" | "Session";
  resourceName: string;
  setIsForm: Function;
}) {
  return (
    <section className={styles["action-panel"]}>
      <div className={styles["action-panel__modal"]}>
        <h3>Delete This {props.resourceType}?</h3>
        <p>
          Are you sure you want to delete this {props.resourceType.toLowerCase()} '{props.resourceName}' ?
        </p>
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
