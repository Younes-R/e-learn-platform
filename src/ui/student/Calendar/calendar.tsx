"use client";
import styles from "./calendar.module.css";
import RightArrow from "@/ui/icons/rightArrow";
import LeftArrow from "@/ui/icons/leftArrow";
import Day from "./day";
import { useState } from "react";
import { DayData } from "@/database/definitions";
import { useQuery } from "@tanstack/react-query";
import ActionSessionPanel from "./actionSessionPanel";
import DeletePanel from "../Courses/deletePanel";

export default function Calendar(props: { userRole: string }) {
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
  const [isAction, setIsAction] = useState<"create" | "edit" | "delete" | null>(null);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number } | null>({
    day: date.getDate(),
    month: date.getMonth(),
  });
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

  const handleDaySelection = ({ day, month, year }: { day: number; month: number; year: number }) => {
    if (selectedDate?.day === day && selectedDate?.month === month) {
      setSelectedDate(null);
    } else {
      setSelectedDate({ day, month });
    }
    if (month !== date.getMonth()) {
      if ((month < date.getMonth() && year === date.getFullYear()) || year < date.getFullYear()) {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1));
      } else {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1));
      }
    }
  };
  const fetchSessions = (year: number, month: number): Promise<Array<DayData>> => {
    return fetch(`/api/sessions?year=${year}&month=${month}`).then((res) => res.json());
  };

  // const { data: currSessions } = useQuery({
  //   queryKey: [date.getFullYear(), date.getMonth()],
  //   queryFn: () => fetchSessions(date.getFullYear(), date.getMonth()),
  // });

  return (
    <>
      <section className={styles["calendar"]}>
        <div className={styles["calendar__first-section"]}>
          <div className={styles["calendar__current-day"]}>
            {/* {`date: ${date}`} <br /> */}
            {/* {`date.getMonth(): ${date.getMonth()}`} <br /> */}
            {/* {`monthsDaysCount[date.getMonth() - 1]: ${
              monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1]
            }`} */}
            {/* <br /> */}
            {/* {`monthsDaysCount[- 1]: ${monthsDaysCount[-1]}`} */}
            {/* {`BLANKS1: ${blanks1[3]}`} */}
            {/* <br /> */}
            {/* {`BLANKS1 LENGTH: ${blanks1.length}`} */}
            {/* <br /> */}
            {/* {`FIRST DAY: ${firstDay}`} */}
            {/* <br /> */}
            {/* {`LAST DAY: ${lastDay} \n ${lastDay.getDay()}`} */}
            {/* <br /> */}
            {/* {`TODAY: ${today}`} */}
            {`${
              selectedDate
                ? new Date(Date.UTC(date.getFullYear(), selectedDate.month, selectedDate.day)).toDateString()
                : date.toDateString()
            }`}
            <br />
            {/* {`BLANKS 2 LENGTH: ${blanks2.length}`} */}
            {/* {`${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getFullYear()} `} */}
          </div>
          <div className={styles["calendar__month"]}>
            <div className={styles["calendar__month__current-month"]}>
              <button
                onClick={() => {
                  setDate(new Date(date.getFullYear(), date.getMonth() - 1));
                  setSelectedDate(null);
                }}
              >
                <LeftArrow />
              </button>
              <form
                className={styles["calendar__month__current-month__form"]}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const year = Number(formData.get("year"));
                  setDate(new Date(year, date.getMonth()));
                }}
              >
                <p>
                  {`${months[date.getMonth()]} `}
                  <input
                    type="number"
                    name="year"
                    value={date.getFullYear()}
                    readOnly={true}
                    min="1900"
                    max="2100"
                    style={{ width: 70 }}
                  />
                  <button
                    type="submit"
                    style={{ display: "none" }}
                  />
                </p>
              </form>
              <button
                onClick={() => {
                  setDate(new Date(date.getFullYear(), date.getMonth() + 1));
                  setSelectedDate(null);
                }}
              >
                <RightArrow />
              </button>
            </div>

            <div className={styles["calendar__month__days-grid"]}>
              {days.map((day) => (
                <div
                  className={styles["calendar__month__days-grid__day-title"]}
                  key={day}
                >
                  {day.substring(0, 3)}
                </div>
              ))}

              {blanks1.map((_, idx) => (
                <Day
                  gridLength={0}
                  gridPosition={idx}
                  num={
                    monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1] - (blanks1.length - idx - 1)
                  }
                  monthIndex={date.getMonth() - 1 == -1 ? 11 : date.getMonth() - 1}
                  yearIndex={date.getMonth() - 1 == -1 ? date.getFullYear() - 1 : date.getFullYear()}
                  todayIndex={today.getDate()}
                  todayMonthIndex={today.getMonth()}
                  todayYearIndex={today.getFullYear()}
                  selectedDate={selectedDate}
                  onClick={handleDaySelection}
                  key={`${date.getMonth() - 1 == -1 ? date.getFullYear() - 1 : date.getFullYear()}-${
                    date.getMonth() - 1 == -1 ? 11 : date.getMonth() - 1
                  }-${
                    monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1] - (blanks1.length - idx - 1)
                  }`}
                />
              ))}
              {Array.from({ length: monthsDaysCount[date.getMonth()] }).map((_, idx) => (
                <Day
                  gridPosition={blanks1.length + idx}
                  gridLength={blanks1.length + blanks2.length + monthsDaysCount[date.getMonth()]}
                  num={idx + 1}
                  monthIndex={date.getMonth()}
                  yearIndex={date.getFullYear()}
                  todayIndex={today.getDate()}
                  todayMonthIndex={today.getMonth()}
                  todayYearIndex={today.getFullYear()}
                  selectedDate={selectedDate}
                  onClick={handleDaySelection}
                  key={`${date.getFullYear()}-${date.getMonth()}-${idx + 1}`}
                />
              ))}
              {blanks2.map((_, idx) => (
                <Day
                  gridPosition={blanks1.length + monthsDaysCount[date.getMonth()] + idx}
                  gridLength={blanks1.length + blanks2.length + monthsDaysCount[date.getMonth()]}
                  num={idx + 1}
                  monthIndex={date.getMonth() + 1 == 12 ? 0 : date.getMonth() + 1}
                  yearIndex={date.getMonth() + 1 == 12 ? date.getFullYear() + 1 : date.getFullYear()}
                  todayIndex={today.getDate()}
                  todayMonthIndex={today.getMonth()}
                  todayYearIndex={today.getFullYear()}
                  selectedDate={selectedDate}
                  onClick={handleDaySelection}
                  key={`${date.getMonth() + 1 == 12 ? date.getFullYear() + 1 : date.getFullYear()}-${
                    date.getMonth() + 1 == 12 ? 0 : date.getMonth() + 1
                  }-${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles["calendar__second-section"]}>
          {props.userRole === "teacher" ? <button onClick={() => setIsAction("create")}>Add Session</button> : null}
          {selectedDate ? <div className={styles["calendar__day-info"]}>{selectedDate.day}</div> : null}
        </div>
      </section>
      {isAction === "create" ? <ActionSessionPanel setIsAction={setIsAction} /> : null}
    </>
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
