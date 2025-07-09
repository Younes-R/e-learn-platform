import styles from "./actionSessionPanel.module.css";

export default function ActionSessionPanel(props: { setIsAction: Function }) {
  return (
    <section className={styles["action-panel"]}>
      <form
        className={styles["action-panel__form"]}
        action=""
      >
        <div className={styles["action-panel__form__header"]}>
          <h3>Create a New Session</h3>
          <div className={styles["action-panel__form__header__actions"]}>
            <button className={styles["action-panel__form__header__actions__create"]}>Create</button>
            <button
              onClick={() => props.setIsAction(null)}
              className={styles["action-panel__form__header__actions__cancel"]}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className={styles["action-panel__form__first-input-div"]}>
          <label htmlFor="from">
            From:
            <input
              type="time"
              name="startTime"
              id="from"
            />
          </label>
          <label htmlFor="to">
            To:
            <input
              type="time"
              name="endTime"
              id="to"
            />
          </label>
        </div>
        <div className={styles["action-panel__form__second-input-div"]}>
          <label htmlFor="day">Day:</label>
          <input
            type="date"
            name="day"
            id="day"
          />
        </div>
        <div className={styles["action-panel__form__third-input-div"]}>
          <label htmlFor="module">
            Module:
            <input
              type="text"
              name="module"
              id="module"
            />
          </label>
          <label htmlFor="level">
            Level:
            <input
              type="text"
              name="level"
              id="level"
            />
          </label>
        </div>
        <div className={styles["action-panel__form__fourth-input-div"]}>
          <label htmlFor="price">
            Price:
            <input
              type="number"
              name="price"
              id="price"
            />
          </label>
          <label htmlFor="type">
            Type:
            <select
              name="type"
              id="type"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>
        <div className={styles["action-panel__form__fifth-input-div"]}>
          <label htmlFor="address-link">Address/Link:</label>
          <input
            type="text"
            name="addressLink"
            id="address-link"
          />
        </div>
        <div className={styles["action-panel__form__sixth-input-div"]}>
          <label htmlFor="places">N° of Places:</label>
          <input
            type="number"
            name="places"
            id="places"
          />
        </div>
      </form>
    </section>
  );
}
