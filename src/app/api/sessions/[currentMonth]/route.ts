import { getSessionsByMonth as teacherGetSessionsByMonth } from "@/database/dal/teacher";
import { getSessionsByMonth as studentGetSessionsByMonth } from "@/database/dal/student";
import { dbSession } from "@/database/definitions";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export async function GET(request: Request, { params }: { params: Promise<{ currentMonth: string }> }) {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student", "teacher"]);
  const { currentMonth: current } = await params;

  // const searchParams = new URLSearchParams(new URL(request.url).searchParams);

  // const current = searchParams.get("current");
  // const previous = searchParams.get("previous");
  // const next = searchParams.get("next");

  const monthsDaysCount = [
    31,
    (Number(current?.split("-")[0]) - 2016) % 4 == 0 ? 29 : 28,
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

  if (
    !(
      current &&
      Number(current?.split("-")[0]) >= 0 &&
      Number(current?.split("-")[1]) > 0 &&
      Number(current?.split("-")[1]) < 13
    )
  ) {
    return new Response(null, { status: 400 });
  }

  //   const currentMonth = {
  //     start: `${current}-01`,
  //     end: `${current}-${monthsDaysCount[Number(current?.split("-")[1]) - 1]}`,
  //   };

  const currentMonth = (() => {
    const currMonth = {
      year: Number(current?.split("-")[0]),
      month: Number(current?.split("-")[1]),
    };

    return {
      start: `${currMonth.year}-${currMonth.month}-01`,
      end: `${currMonth.year}-${currMonth.month}-${monthsDaysCount[currMonth.month - 1]}`,
    };
  })();

  let currentMonthSessions = new Map() as Map<string, Array<dbSession>>;
  // let previousMonthSessions = new Map() as Map<string, Array<dbSession>>;
  // let nextMonthSessions = new Map() as Map<string, Array<dbSession>>;

  try {
    let res = [];
    if (role === "student") {
      res = await studentGetSessionsByMonth(email, currentMonth);
    } else {
      res = await teacherGetSessionsByMonth(email, currentMonth);
    }
    res.map((session) => {
      const day = `${session.day.getFullYear()}-${session.day.getMonth() + 1}-${session.day.getDate()}`;
      const daySessions = currentMonthSessions.get(day);
      if (daySessions) {
        currentMonthSessions.set(day, daySessions.concat(session));
      } else {
        currentMonthSessions.set(day, [session]);
      }
    });
  } catch (err: any) {
    console.error(err.message);
    console.error("[API sessions]: Failed to get current sessions.");
    return new Response(null, { status: 500 });
  }

  // let prevMonth = null;
  // let nextMonth = null;

  // if (previous === "true") {
  //   prevMonth = (() => {
  //     const currentMonth = {
  //       year: Number(current?.split("-")[0]),
  //       month: Number(current?.split("-")[1]),
  //     };
  //     const previousMonth = {
  //       year: currentMonth.month - 1 !== 0 ? currentMonth.year : currentMonth.year - 1,
  //       month: currentMonth.month - 1 !== 0 ? currentMonth.month - 1 : 12,
  //     };
  //     // currentMonth.month - 1 !== 0
  //     //   ? `${currentMonth.year}-${currentMonth.month - 1}-01`
  //     //   : `${currentMonth.year - 1}-12-01`,

  //     return {
  //       start: `${previousMonth.year}-${previousMonth.month}-01`,
  //       end: `${previousMonth.year}-${previousMonth.month}-${monthsDaysCount[previousMonth.month - 1]}`,
  //     };
  //   })();

  //   try {
  //     const res = await getSessionsByMonth("didact@gmail.com", prevMonth);
  //     res.map((session) => {
  //       const day = `${session.day.getFullYear()}-${session.day.getMonth() + 1}-${session.day.getDate()}`;
  //       const daySessions = previousMonthSessions.get(day);
  //       if (daySessions) {
  //         previousMonthSessions.set(day, daySessions.concat(session));
  //       } else {
  //         previousMonthSessions.set(day, [session]);
  //       }
  //     });
  //   } catch (err: any) {
  //     console.error(err.message);
  //     console.error("[API sessions]: Failed to get previous sessions.");
  //   }
  // }

  // if (next === "true") {
  //   nextMonth = (() => {
  //     const currentMonth = {
  //       year: Number(current?.split("-")[0]),
  //       month: Number(current?.split("-")[1]),
  //     };
  //     const nexMonth = {
  //       year: currentMonth.month + 1 !== 13 ? currentMonth.year : currentMonth.year + 1,
  //       month: currentMonth.month + 1 !== 13 ? currentMonth.month + 1 : 1,
  //     };

  //     return {
  //       start: `${nexMonth.year}-${nexMonth.month}-01`,
  //       end: `${nexMonth.year}-${nexMonth.month}-${monthsDaysCount[nexMonth.month - 1]}`,
  //     };
  //   })();

  //   try {
  //     const res = await getSessionsByMonth("didact@gmail.com", nextMonth);
  //     res.map((session) => {
  //       const day = `${session.day.getFullYear()}-${session.day.getMonth() + 1}-${session.day.getDate()}`;
  //       const daySessions = nextMonthSessions.get(day);
  //       if (daySessions) {
  //         nextMonthSessions.set(day, daySessions.concat(session));
  //       } else {
  //         nextMonthSessions.set(day, [session]);
  //       }
  //     });
  //   } catch (err: any) {
  //     console.error(err.message);
  //     console.error("[API sessions]: Failed to get next sessions.");
  //   }
  // }

  //   console.log("Prev:", prevMonth);
  //   console.log("Current:", currentMonth);
  //   console.log("Next:", nextMonth);
  // let sessions;
  // try {
  //   sessions = await getSessionsByMonth("didact@gmail.com", currentMonth);
  // } catch (err: any) {
  //   console.error(err.message);
  //   console.error("[API sessions]: Failed to get sessions.");
  // }
  // console.log(currentMonthSessions.keys());
  // console.log(currentMonthSessions.get("2025-8-11"));
  // console.log(previousMonthSessions.keys());
  // console.log(nextMonthSessions.keys());

  return Response.json({
    // sessionsArray: current ? Array.from(currentMonthSessions) : null,
    // sessionsObject: current ? Object.fromEntries(currentMonthSessions) : null,
    // sessionsObject2025dash8: current ? Object.fromEntries(currentMonthSessions)["2025-8-11"] : null,
    // previousMonthSessions: previous ? previousMonthSessions : null,
    // nextMonthSessions: next ? nextMonthSessions : null,
    sessions: current ? Object.fromEntries(currentMonthSessions) : null,
  });
}
