import styles from "./session.module.css";

export default function Session(props: {
  session: {
    seid: string;
    module: string;
    day: Date;
    remainingPlaces: number;
    startTime: string;
    endTime: string;
    type: string;
    addressLink: string;
    firstName: string;
    lastName: string;
  };
}) {
  return (
    <div className={styles["sessions"]}>
      <section className={styles["session"]}>
        <h3 className={styles["session__header"]}>Sessions</h3>
        <div className={styles["session__body"]}>
          <h4 className={styles["session__body__header"]}>{props.session.module}</h4>
          <ul className={styles["session__body__time-info-list"]}>
            <li>{props.session.day.toDateString()}</li>
            <li>{`${props.session.startTime}-${props.session.endTime}`}</li>
            <li>
              {props.session.remainingPlaces === 0
                ? "No places remaining"
                : props.session.remainingPlaces === 0
                ? "1 place remaining"
                : props.session.remainingPlaces > 1
                ? `${props.session.remainingPlaces} places remaining`
                : ""}
            </li>
          </ul>
          <ul className={styles["session__body__info-list"]}>
            <li>
              By{" "}
              {`${props.session.firstName[0].toUpperCase()}. ${
                props.session.lastName[0].toUpperCase() + props.session.lastName.substring(1)
              }`}
            </li>
            <li>
              <span className={props.session.type === "online" ? styles["online"] : undefined}>
                {props.session.type[0].toUpperCase() + props.session.type.substring(1)}
              </span>
            </li>
          </ul>
        </div>
        <div className={styles["session__body__address"]}>
          {props.session.type === "online" ? (
            <p>
              Session link:{" "}
              <a
                className={styles["link"]}
                href={props.session.addressLink}
                target="_blank"
              >
                {props.session.addressLink}
              </a>
            </p>
          ) : (
            <p>
              Session Address: <span>{props.session.addressLink}</span>
            </p>
          )}
        </div>
      </section>
      <section className={styles["second-section"]}>
        <button className={styles["second-section__join"]}>Join Session</button>
        <button className={styles["second-section__undo"]}>Undo Joining</button>
      </section>
    </div>
  );
}
