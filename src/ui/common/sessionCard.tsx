import styles from "./sessionCard.module.css";
import Link from "next/link";

export default function SessionCard(props: {
  sessionData: {
    seid: string;
    module: string;
    day: Date;
    startTime: string;
    endTime: string;
    type: string;
    firstName: string;
    lastName: string;
    price: number;
  };
}) {
  return (
    <li className={styles["card"]}>
      <h4 className={styles["card__header"]}>{`${
        props.sessionData.module[0].toUpperCase() + props.sessionData.module.substring(1)
      }`}</h4>
      <ul className={styles["card__time-info-list"]}>
        <li>{`${props.sessionData.day.toDateString()}`}</li>
        <li>{`${props.sessionData.startTime} - ${props.sessionData.endTime}`}</li>
        <li>
          {/* here we should style "online" with green while with black if it is not offline. check again the design  */}
          <span>{`${props.sessionData.type}`}</span>
        </li>
      </ul>
      <ul className={styles["card__info-list"]}>
        <li>{`By ${props.sessionData.firstName[0].toUpperCase()}. ${
          props.sessionData.lastName[0].toUpperCase() + props.sessionData.lastName.substring(1)
        }`}</li>
        <li>
          <span>{`${props.sessionData.price}DA`}</span>
        </li>
      </ul>
      <button>
        <Link href={`explore/sessions/${props.sessionData.seid}`}>View Session</Link>
      </button>
    </li>
  );
}
