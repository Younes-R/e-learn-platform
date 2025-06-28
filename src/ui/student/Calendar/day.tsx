import styles from "./day.module.css";

export default function Day(props: {
  num: number;
  monthIndex?: number;
  todayIndex?: number;
  todayMonthIndex?: number;
}) {
  return (
    <div
      className={`${styles["day"]} ${
        props.num === props.todayIndex && props.monthIndex === props.todayMonthIndex ? styles["today"] : ""
      } `}
    >
      {props.num}
    </div>
  );
}
