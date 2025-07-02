"use client";

import styles from "./reports.module.css";
import { Report } from "@/database/definitions";
import { useState } from "react";

export default function Reports(props: { reports: Array<Report> }) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleClick = (report: Report) => {
    if (!selectedReport) {
      setSelectedReport(report);
    } else {
      if (
        selectedReport.reporterId === report.reporterId &&
        selectedReport.reportedId === report.reportedId &&
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
        <ul className={styles["first-section__reports-list"]}>
          {props.reports.map((report) => (
            <li
              className={`${styles["first-section__reports-list__item"]}  ${
                selectedReport &&
                selectedReport.reporterId === report.reporterId &&
                selectedReport.reportedId === report.reportedId &&
                selectedReport.date === report.date
                  ? styles["appear"]
                  : ""
              } `}
              key={report.reportedId + report.reportedId}
              onClick={() => {
                handleClick(report);
              }}
            >
              <h4>{`Report ${report.reporterId}`} </h4>
              <p>{`Reason: ${report.reason}`}</p>
            </li>
          ))}
        </ul>
      </section>
      {selectedReport ? (
        <section className={styles["second-section"]}>
          <div className={styles["report-info"]}>
            <h3 className={styles["report-info__header"]}>{`Report ${selectedReport.reporterId}`} </h3>
            <ul className={styles["report-info__info-list"]}>
              <li>{`Reporter: ${selectedReport.reporterName}`}</li>
              <li>{`Reported: ${selectedReport.reportedName}`}</li>
              <li>{`Date: ${selectedReport.date.toDateString()}`}</li>
              <li>{`Reason: ${selectedReport.reason}`}</li>
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
