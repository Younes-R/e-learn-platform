import { DayData } from "@/database/definitions";
import styles from "./day.module.css";

export default function Day(props: {
  num: number;
  monthIndex?: number;
  todayIndex?: number;
  yearIndex?: number;
  todayMonthIndex?: number;
  todayYearIndex?: number;
  selectedDate?: { day: number; month: number } | null;
  onClick?: Function;
  dayData?: DayData;
}) {
  return (
    <div
      onClick={() => {
        if (props.onClick) {
          props.onClick({ day: props.num, month: props.monthIndex, year: props.yearIndex });
        }
      }}
      className={`
        ${styles["day"]}
        ${
          props.num === props.todayIndex &&
          props.monthIndex === props.todayMonthIndex &&
          props.yearIndex === props.todayYearIndex
            ? styles["today"]
            : ""
        }
        ${
          props.num === props.selectedDate?.day && props.monthIndex === props.selectedDate.month
            ? styles["selected-day"]
            : ""
        }
        
        `}
    >
      {props.num}
      {/* /{props.monthIndex}/{props.yearIndex} */}
    </div>
  );
}
