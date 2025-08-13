"use client";
import styles from "./calendar.module.css";
import RightArrow from "@/ui/icons/rightArrow";
import LeftArrow from "@/ui/icons/leftArrow";
import Day from "./day";
import { useState } from "react";
import { DayData, dbSession } from "@/database/definitions";
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
  const [selectedDaySessions, setSelectedDaySessions] = useState<dbSession[] | null>(null);

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

  const handleDaySelection = ({
    day,
    month,
    year,
    dayData,
  }: {
    day: number;
    month: number;
    year: number;
    dayData: dbSession[];
  }) => {
    if (selectedDate?.day === day && selectedDate?.month === month) {
      setSelectedDate(null);
      setSelectedDaySessions(null);
    } else {
      setSelectedDate({ day, month });
      setSelectedDaySessions(dayData);
    }
    if (month !== date.getMonth()) {
      if ((month < date.getMonth() && year === date.getFullYear()) || year < date.getFullYear()) {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1));
        setSelectedDaySessions(dayData);
      } else {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1));
        setSelectedDaySessions(dayData);
      }
    }
  };
  const fetchSessions = async (year: number, month: number) => {
    const res = await fetch(`/api/sessions/${year}-${month}`);
    const data = await res.json();
    console.log("CLIENT data:", data);
    const sessions = data.sessions as Record<string, dbSession[]>;
    if (sessions) {
      Object.values(sessions).forEach((list: dbSession[]) => {
        list.forEach((s) => {
          s.day = new Date(s.day) as unknown as any; // or assign to a new property, e.g. s.dayDate = new Date(s.day)
        });
      });
    }

    return sessions;
  };

  const { data: currSessions } = useQuery({
    queryKey: [date.getFullYear(), date.getMonth() + 1],
    queryFn: async () => await fetchSessions(date.getFullYear(), date.getMonth() + 1),
  });

  console.log(`CLIENT currSessions:`, currSessions);
  console.log(`CLIENT currSessions:`, currSessions);

  let prevSessions: Record<string, dbSession[]> | undefined;

  const prevMonthSessions = new Date(Date.UTC(date.getFullYear(), date.getMonth() - 1));
  const { data: previousSessions } = useQuery({
    queryKey: [prevMonthSessions.getFullYear(), prevMonthSessions.getMonth() + 1],
    queryFn: async () => await fetchSessions(prevMonthSessions.getFullYear(), prevMonthSessions.getMonth() + 1),
  });

  prevSessions = previousSessions;

  let nexSessions: Record<string, dbSession[]> | undefined;

  const nexMonthSessions = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1));
  const { data: nextSessions } = useQuery({
    queryKey: [nexMonthSessions.getFullYear(), nexMonthSessions.getMonth() + 1],
    queryFn: async () => await fetchSessions(nexMonthSessions.getFullYear(), nexMonthSessions.getMonth() + 1),
  });

  nexSessions = nextSessions;

  return (
    <>
      <section className={styles["calendar"]}>
        <div className={styles["calendar__first-section"]}>
          <div className={styles["calendar__current-day"]}>
            {/* {currSessions && Object.keys(currSessions).length > 0
              ? `SIZE: ${
                  Object.keys(currSessions).length > 0
                    ? Object.keys(currSessions).length + `${Object.keys(currSessions)}`
                    : "fas"
                }`
              : ""}{" "}
            <br /> */}
            {/* {`CURR SESSIONS Sessions: ${currSessions}`} <br /> */}
            {/* {currSessions?.sessions ? (
              <ul>
                {currSessions.sessions.map((session) => (
                  <li key={session.seid}>{session}</li>
                ))}
              </ul>
            ) : null} */}
            {/* {`date: ${date}`} <br /> */}
            {/* {`date.getMonth(): ${date.getMonth()}`} <br /> */}
            {/* {`monthsDaysCount[date.getMonth() - 1]: ${
              monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1]
            }`} */}
            {/* <br /> */}
            {/* {`monthsDaysCount[- 1]: ${monthsDaysCount[-1]}`} */}
            {/* {`BLANKS1: ${blanks1[3]}`} */}
            {/* <br /> */}
            {/* {`BLANKS1 LENGTH: ${blanks1.length}`} <br /> */}
            {/* {`BLANKS2 LENGTH: ${blanks2.length}`} <br /> */}
            {/* {`BLANKS2 LENGTH: ${currSessions["s"]}`} <br /> */}
            {/* {currSessions && currSessions["2025-8-11"] ? (
              <ul>
                {currSessions["2025-8-11"].map((session, idx) => (
                  <li>
                    {` [${idx}]:
                  seid: ${session.seid} ;
                  module: ${session.module};
                  level: ${session.level};
                  price: ${session.price} ;
                  type: ${session.type} ;
                  addressLink: ${session.addressLink};
                  day: ${session.day} ;
                  startTime: ${session.startTime};
                  endTime: ${session.endTime};
                  places: ${session.places} ;
                  `}
                  </li>
                ))}
              </ul>
            ) : null} */}
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
                  dayData={
                    prevSessions && Object.keys(prevSessions).length > 0
                      ? prevSessions[
                          `${date.getMonth() - 1 == -1 ? date.getFullYear() - 1 : date.getFullYear()}-${
                            date.getMonth() - 1 == -1 ? 12 : date.getMonth()
                          }-${
                            monthsDaysCount[date.getMonth() - 1 == -1 ? 0 : date.getMonth() - 1] -
                            (blanks1.length - idx - 1)
                          }`
                        ]
                      : undefined
                  }
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
                  dayData={
                    currSessions && Object.keys(currSessions).length > 0
                      ? currSessions[`${date.getFullYear()}-${date.getMonth() + 1}-${idx + 1}`]
                      : undefined
                  }
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
                  dayData={
                    nexSessions && Object.keys(nexSessions).length > 0
                      ? nexSessions[
                          `${date.getMonth() + 1 == 12 ? date.getFullYear() + 1 : date.getFullYear()}-${
                            date.getMonth() + 1 == 12 ? 1 : date.getMonth() + 2
                          }-${idx + 1}`
                        ]
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles["calendar__second-section"]}>
          {props.userRole === "teacher" ? <button onClick={() => setIsAction("create")}>Add Session</button> : null}
          {selectedDate ? (
            <div className={styles["calendar__day-info"]}>
              {selectedDaySessions && Object.keys(selectedDaySessions).length > 0 ? (
                <>
                  <p>
                    {selectedDaySessions.length === 1
                      ? "You have one session:"
                      : `You have ${selectedDaySessions.length} sessions:`}
                  </p>
                  <ul className={styles["calendar__day-info__list"]}>
                    {selectedDaySessions.map((session) => (
                      <li key={session.seid}>
                        <b>{session.module}:</b> from {session.startTime} to {session.endTime}.
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No sessions at this day.</p>
              )}
            </div>
          ) : null}
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
