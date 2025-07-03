"use client";

import { SessionData } from "@/database/definitions";
import styles from "./sessions.module.css";
import { useState } from "react";

export default function Sessions(props: { sessionsData: Array<SessionData> }) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleClick = (seid: string) => {
    if (!selectedSession) {
      setSelectedSession(seid);
    } else {
      if (selectedSession === seid) {
        setSelectedSession(null);
      } else {
        setSelectedSession(seid);
      }
    }
  };

  return (
    <div className={styles["sessions"]}>
      <section className={styles["first-section"]}>
        <ul className={styles["sessions-list"]}>
          {props.sessionsData.map((session) => (
            <li
              onClick={() => handleClick(session.seid)}
              key={session.seid}
              className={` ${styles["sessions-list__item"]} ${
                session.seid === selectedSession ? styles["appear"] : ""
              }`}
            >
              <span className={styles["sessions-list__item__date"]}>{`${session.startTime} - ${session.endTime}`}</span>
              <h4 className={styles["sessions-list__item__header"]}>{session.module}</h4>
              <p className={styles["sessions-list__item__teacher"]}>{`By ${session.teacher}`}</p>
              <span className={styles["sessions-list__item__price"]}>{`${session.price} DA`}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles["second-section"]}>
        {selectedSession ? (
          <div className={styles["session-info"]}>
            <h3 className={styles["session-info__header"]}>
              {props.sessionsData.find((session) => session.seid === selectedSession)?.module}
            </h3>
            <ul className={styles["session-info__time-info-list"]}>
              <li>{props.sessionsData.find((session) => session.seid === selectedSession)?.day.toDateString()}</li>
              <li>{`${props.sessionsData.find((session) => session.seid === selectedSession)?.startTime} - ${
                props.sessionsData.find((session) => session.seid === selectedSession)?.endTime
              } `}</li>
              <li>
                <span
                  className={
                    props.sessionsData.find((session) => session.seid === selectedSession)?.type === "online"
                      ? styles["session-info__time-info-list__online"]
                      : styles["session-info__time-info-list__address"]
                  }
                >
                  {props.sessionsData.find((session) => session.seid === selectedSession)?.type === "online"
                    ? "Online"
                    : props.sessionsData.find((session) => session.seid === selectedSession)?.addressLink}
                </span>
              </li>
            </ul>
            <ul className={styles["session-info__info-list"]}>
              <li>By Dr. Zedek</li>
              <li>
                <span>200DA</span>
              </li>
            </ul>
            <p>280 students enrolled in</p>
            <div className={styles["session-info__info"]}></div>
            <div className={styles["session-info__actions"]}>
              <button className={styles["session-info__actions__edit"]}>Edit</button>
              <button className={styles["session-info__actions__delete"]}>Delete</button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
