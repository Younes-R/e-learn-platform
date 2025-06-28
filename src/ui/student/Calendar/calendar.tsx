"use client";
import styles from "./calendar.module.css";
import RightArrow from "@/ui/icons/rightArrow";
import LeftArrow from "@/ui/icons/leftArrow";
import Day from "./day";
import { useState } from "react";

export default function Calendar() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(date.getDate());
  const monthsDaysCount = [
    31,
    (date.getFullYear() - 2016) % 4 == 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
    30,
    31,
  ];
  const today = new Date(); // use this to highlight today
  const firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const lastDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), monthsDaysCount[date.getMonth()]));
  const blanks1 = Array.from({ length: firstDay.getDay() });
  const blanks2 = Array.from({ length: 7 - lastDay.getDay() - 1 });

  return (
    <section className={styles["calendar"]}>
      <div className={styles["calendar__first-section"]}>
        <div className={styles["calendar__current-day"]}>
          {`date: ${date}`} <br />
          {`date.getMonth(): ${date.getMonth()}`} <br />
          {`monthsDaysCount[date.getMonth() - 1]: ${
            monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1]
          }`}
          <br />
          {`monthsDaysCount[- 1]: ${monthsDaysCount[-1]}`}
          {/* {`BLANKS1: ${blanks1[3]}`} */}
          <br />
          {`BLANKS1 LENGTH: ${blanks1.length}`}
          <br />
          {`FIRST DAY: ${firstDay}`}
          <br />
          {`LAST DAY: ${lastDay} \n ${lastDay.getDay()}`}
          <br />
          {`TODAY: ${today}`}
          <br />
          {`${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getFullYear()} `}
        </div>
        <div className={styles["calendar__month"]}>
          <div className={styles["calendar__month__current-month"]}>
            <button
              onClick={() => {
                setDate(new Date(date.getFullYear(), date.getMonth() - 1));
              }}
            >
              <LeftArrow />
            </button>
            <p>{`${months[date.getMonth()]} ${date.getFullYear()}`}</p>
            <button
              onClick={() => {
                setDate(new Date(date.getFullYear(), date.getMonth() + 1));
              }}
            >
              <RightArrow />
            </button>
          </div>

          <div className={styles["calendar__month__days-grid"]}>
            <div className={styles["calendar__month__days-grid__day-title"]}>Sun</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Mon</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Tue</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Wed</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Thu</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Fri</div>
            <div className={styles["calendar__month__days-grid__day-title"]}>Sat</div>
            {blanks1.map((_, idx) => (
              <Day
                num={monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1] - (blanks1.length - idx - 1)}
              />
            ))}
            {Array.from({ length: monthsDaysCount[date.getMonth()] }).map((_, idx) => (
              <Day
                num={idx + 1}
                monthIndex={date.getMonth()}
                yearIndex={date.getFullYear()}
                todayIndex={today.getDate()}
                todayMonthIndex={today.getMonth()}
                todayYearIndex={today.getFullYear()}
              />
            ))}
            {blanks2.map((_, idx) => (
              <Day num={idx + 1} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles["calendar__second-section"]}>
        <button>Add Session</button>
        <div className={styles["calendar__day-info"]}>There is two (2) sessions on this day.</div>
      </div>
    </section>
  );
}

{
  /* <Day num={1} />
<Day num={2} />
<Day num={3} />
<Day num={4} />
<Day num={5} />
<Day num={6} />
<Day num={7} />
<Day num={8} />
<Day num={9} />
<Day num={10} />
<Day num={11} />
<Day num={12} />
<Day num={13} />
<Day num={14} />
<Day num={15} />
<Day num={16} />
<Day num={17} />
<Day num={18} />
<Day num={19} />
<Day num={20} />
<Day num={21} />
<Day num={22} />
<Day num={23} />
<Day num={24} />
<Day num={25} />
<Day num={26} />
<Day num={27} />
<Day num={28} />
<Day num={29} />
<Day num={30} />
<Day num={31} /> */
}
