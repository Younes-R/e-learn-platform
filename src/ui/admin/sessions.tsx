"use client";

import { SessionData } from "@/database/definitions";
import styles from "./sessions.module.css";
import { useState } from "react";
import DeletePanel from "../student/Courses/deletePanel";

export default function Sessions(props: { sessionsData: Array<SessionData> | null }) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isAction, setIsAction] = useState<"edit" | "delete" | null>(null);

  const selectedSessionObject = props.sessionsData
    ? props.sessionsData.find((session) => session.seid === selectedSession)
    : null;

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
        {props.sessionsData ? (
          <ul className={styles["sessions-list"]}>
            {props.sessionsData.map((session) => (
              <li
                onClick={() => handleClick(session.seid)}
                key={session.seid}
                className={` ${styles["sessions-list__item"]} ${
                  session.seid === selectedSession ? styles["appear"] : ""
                }`}
              >
                <span
                  className={styles["sessions-list__item__date"]}
                >{`${session.startTime} - ${session.endTime}`}</span>
                <h4 className={styles["sessions-list__item__header"]}>{session.module}</h4>
                <p className={styles["sessions-list__item__teacher"]}>{`By ${session.firstName[0].toUpperCase()}. ${
                  session.lastName[0].toUpperCase() + session.lastName.substring(1)
                }`}</p>
                <span className={styles["sessions-list__item__price"]}>{`${session.price} DA`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions to display.</p>
        )}
      </section>
      {props.sessionsData && selectedSessionObject ? (
        <section className={styles["second-section"]}>
          {selectedSession ? (
            <div className={styles["session-info"]}>
              <h3 className={styles["session-info__header"]}>{selectedSessionObject?.module}</h3>
              <ul className={styles["session-info__time-info-list"]}>
                <li>{selectedSessionObject?.day.toDateString()}</li>
                <li>{`${selectedSessionObject?.startTime} - ${selectedSessionObject?.endTime} `}</li>
                <li>
                  <span
                    className={
                      selectedSessionObject?.type === "online"
                        ? styles["session-info__time-info-list__online"]
                        : styles["session-info__time-info-list__address"]
                    }
                  >
                    {selectedSessionObject?.type === "online" ? "Online" : selectedSessionObject?.addressLink}
                  </span>
                </li>
              </ul>
              <ul className={styles["session-info__info-list"]}>
                <li>{`By ${selectedSessionObject?.firstName[0].toUpperCase()}. ${
                  selectedSessionObject?.lastName[0].toUpperCase() + selectedSessionObject?.lastName.substring(1)
                }`}</li>
                <li>
                  <span>{`${selectedSessionObject.price}DA`}</span>
                </li>
              </ul>
              <p>{`...(implement this) students enrolled in`}</p>
              <div className={styles["session-info__info"]}></div>
              <div className={styles["session-info__actions"]}>
                <button
                  onClick={() => setIsAction("edit")}
                  className={styles["session-info__actions__edit"]}
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsAction("delete")}
                  className={styles["session-info__actions__delete"]}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {props.sessionsData && isAction === "delete" ? (
        <DeletePanel
          resourceType="Session"
          resourceName={selectedSessionObject?.module!}
          setIsForm={setIsAction}
        />
      ) : null}
    </div>
  );
}
