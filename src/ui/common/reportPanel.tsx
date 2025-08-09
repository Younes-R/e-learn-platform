"use client";
import styles from "./reportPanel.module.css";
import { reportUser as saReportUser } from "@/actions/common";
import { useActionState } from "react";

export default function ReportPanel(props: { profileEmail: string; setIsAction: Function }) {
  async function reportUser(previousState: any, formData: FormData) {
    return await saReportUser(props.profileEmail, new Date(), Number(formData.get("reason")));
  }
  const [state, formAction, isPending] = useActionState(reportUser, undefined);
  return (
    <section className={styles["report-panel"]}>
      <form
        className={styles["form"]}
        action={formAction}
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
              value="1"
            />
            Spam
          </label>
          <label htmlFor="scam">
            <input
              type="radio"
              name="reason"
              id="scam"
              value="2"
            />
            Scam
          </label>
          <label htmlFor="false-information">
            <input
              type="radio"
              name="reason"
              id="false-information"
              value="3"
            />
            False information
          </label>
          <label htmlFor="inappropriate-behavior">
            <input
              type="radio"
              name="reason"
              id="inappropriate-behavior"
              value="4"
            />
            Inappropriate behavior
          </label>
          <label htmlFor="i-just-dont-like-it">
            <input
              type="radio"
              name="reason"
              id="i-just-dont-like-it"
              value="5"
            />
            I just don't like it
          </label>
          <label htmlFor="something-else">
            <input
              type="radio"
              name="reason"
              id="something-else"
              value="6"
            />
            Something else
          </label>
        </div>
        {state ? <p style={{ color: "red" }}>{state}</p> : null}
      </form>
    </section>
  );
}
