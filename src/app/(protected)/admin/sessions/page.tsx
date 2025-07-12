import styles from "./page.module.css";
import Sessions from "@/ui/admin/sessions";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Sessions</h2>
      <Sessions
        sessionsData={[
          {
            seid: "111111",
            module: "Language Theory",
            year: "1CS",
            type: "online",
            addressLink: "https:zoom.com/meet?l=afsdflk4250nf",
            price: 2000,
            teacher: "Dr. Zedek",
            day: new Date(Date.UTC(2024, 4, 12)),
            startTime: "10:00",
            endTime: "11:00",
          },
          {
            seid: "22222",
            module: "Formal Methods",
            year: "1CS",
            type: "online",
            addressLink: "https:zoom.com/meet?l=doanf43598jfds",
            price: 3500,
            teacher: "Dr. Zedek",
            day: new Date(Date.UTC(2024, 5, 22)),
            startTime: "13:00",
            endTime: "14:00",
          },
          {
            seid: "333333",
            module: "Electronics 02",
            year: "2CP",
            type: "offline",
            addressLink: "https:maps.google.com?lat=21&lon=43",
            price: 2200,
            teacher: "Dr. Ali Djenadi",
            day: new Date(Date.UTC(2024, 2, 10)),
            startTime: "8:00",
            endTime: "9:00",
          },
        ]}
      />
    </main>
  );
}
