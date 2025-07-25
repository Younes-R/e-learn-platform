import { DayData } from "@/database/definitions";
import styles from "./day.module.css";

export default function Day(props: {
  gridPosition: number;
  gridLength: number;
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
        ${
          props.gridLength > 36 && [35, 36, 37, 38, 39, 40, 41].includes(props.gridPosition)
            ? styles["last-line"]
            : props.gridLength < 36 && [28, 29, 30, 31, 32, 33, 34].includes(props.gridPosition)
            ? styles["last-line"]
            : ""
        }

        ${
          props.gridLength > 36 && props.gridPosition === 35
            ? styles["left-angle"]
            : props.gridLength > 36 && props.gridPosition === 41
            ? styles["right-angle"]
            : props.gridLength < 36 && props.gridPosition === 28
            ? styles["left-angle"]
            : props.gridLength < 36 && props.gridPosition === 34
            ? styles["right-angle"]
            : ""
        }
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
      {/* <br /> */}
      {/* <p style={{ color: "orange" }}>{props.gridPosition}</p> */}
      {/* <p style={{ color: "red" }}>{props.gridLength}</p> */}
      {/* /{props.monthIndex}/{props.yearIndex} */}
    </div>
  );
}
