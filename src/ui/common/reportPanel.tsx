import styles from "./reportPanel.module.css";

export default function ReportPanel(props: { profileEmail: string; setIsAction: Function }) {
  return (
    <section className={styles["report-panel"]}>
      <form
        className={styles["form"]}
        action=""
      >
        <div className={styles["form__header"]}>
          <h3>Report Account</h3>
          <div className={styles["form__header__actions"]}>
            <button className={styles["form__header__actions__report"]}>Report</button>
            <button
              onClick={() => props.setIsAction(null)}
              className={styles["form__header__actions__cancel"]}
            >
              Cancel
            </button>
          </div>
        </div>
        <p>Why are you reporting this account? Please choose one of the given options below:</p>
        <div className={styles["form__options"]}>
          <label htmlFor="spam">
            <input
              type="radio"
              name="reason"
              id="spam"
              value="spam"
            />
            Spam
          </label>
          <label htmlFor="scam">
            <input
              type="radio"
              name="reason"
              id="scam"
              value="scam"
            />
            Scam
          </label>
          <label htmlFor="false-information">
            <input
              type="radio"
              name="reason"
              id="false-information"
              value="false information"
            />
            False information
          </label>
          <label htmlFor="inappropriate-behavior">
            <input
              type="radio"
              name="reason"
              id="inappropriate-behavior"
              value="inappropriate behavior"
            />
            Inappropriate behavior
          </label>
          <label htmlFor="i-just-dont-like-it">
            <input
              type="radio"
              name="reason"
              id="i-just-dont-like-it"
              value="I just don't like it"
            />
            I just don't like it
          </label>
          <label htmlFor="something-else">
            <input
              type="radio"
              name="reason"
              id="something-else"
              value="something else"
            />
            Something else
          </label>
        </div>
      </form>
    </section>
  );
}
