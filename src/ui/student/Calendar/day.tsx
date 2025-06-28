import styles from "./day.module.css";

export default function Day(props: {
  num: number;
  monthIndex?: number;
  todayIndex?: number;
  yearIndex?: number;
  todayMonthIndex?: number;
  todayYearIndex?: number;
}) {
  return (
    <div
      className={`${styles["day"]} ${
        props.num === props.todayIndex &&
        props.monthIndex === props.todayMonthIndex &&
        props.yearIndex === props.todayYearIndex
          ? styles["today"]
          : ""
      } `}
    >
      {props.num}
    </div>
  );
}
