"use client";

import styles from "./reports.module.css";
// import { Report } from "@/database/definitions";
import { useState } from "react";

const reason = [
  "spam",
  "scam",
  "false information",
  "inappropriate-behavior",
  "I just don't like it",
  "Something else",
];
interface Report {
  reporterFirstName: string;
  reporterLastName: string;
  reporterEmail: string;
  reportedFirstName: string;
  reportedLastName: string;
  reportedEmail: string;
  date: Date;
  reason: number;
}

export default function Reports(props: { reports: Array<Report> | null }) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleClick = (report: Report) => {
    if (!selectedReport) {
      setSelectedReport(report);
    } else {
      if (
        selectedReport.reporterEmail === report.reporterEmail &&
        selectedReport.reportedEmail === report.reportedEmail &&
        selectedReport.date === report.date
      ) {
        setSelectedReport(null);
      } else {
        setSelectedReport(report);
      }
    }
  };

  return (
    <div className={styles["reports"]}>
      <section className={styles["first-section"]}>
        {props.reports ? (
          <ul className={styles["first-section__reports-list"]}>
            {props.reports.map((report) => (
              <li
                className={`${styles["first-section__reports-list__item"]}  ${
                  selectedReport &&
                  selectedReport.reporterEmail === report.reporterEmail &&
                  selectedReport.reportedEmail === report.reportedEmail &&
                  selectedReport.date === report.date
                    ? styles["appear"]
                    : ""
                } `}
                key={report.reporterEmail + report.reportedEmail + report.date.toDateString()}
                onClick={() => {
                  handleClick(report);
                }}
              >
                <h4>{`Report from ${report.reporterEmail}`} </h4>
                <p>{`Reason: ${reason[report.reason]}`}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports to display.</p>
        )}
      </section>
      {selectedReport ? (
        <section className={styles["second-section"]}>
          <div className={styles["report-info"]}>
            <h3 className={styles["report-info__header"]}>{`Report`} </h3>
            <ul className={styles["report-info__info-list"]}>
              <li>{`Reporter: ${selectedReport.reporterFirstName[0].toUpperCase()} ${
                selectedReport.reporterLastName[0].toUpperCase() + selectedReport.reporterLastName.substring(1)
              }`}</li>
              <li>{`Reported: ${selectedReport.reportedFirstName[0].toUpperCase()} ${
                selectedReport.reportedLastName[0].toUpperCase() + selectedReport.reportedLastName.substring(1)
              }`}</li>
              <li>{`Date: ${selectedReport.date.toDateString()}`}</li>
              <li>{`Reason: ${reason[selectedReport.reason]}`}</li>
            </ul>
            <div className={styles["report-info__actions"]}>
              <button className={styles["report-info__actions__ignore"]}>Ignore</button>
              <button className={styles["report-info__actions__suspend"]}>Suspend Account</button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
