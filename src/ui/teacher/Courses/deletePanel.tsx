import styles from "./deletePanel.module.css";
import { deleteCourse } from "@/actions/teacher";

export default function DeletePanel(props: {
  resourceType: "Student" | "Teacher" | "Moderator" | "Course" | "Session";
  resourceName: string;
  resourceId: string;
  setResource: Function;
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
          <button
            onClick={async () => {
              await deleteCourse(props.resourceId);
              props.setResource(null);
              props.setIsForm(null);
            }}
            className={styles["action-panel__modal__actions__delete"]}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
