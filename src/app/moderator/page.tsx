import styles from "./page.module.css";
import Reports from "@/ui/moderator/reports";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Reports</h2>
      <Reports
        reports={[
          {
            reporterId: "s434dasds",
            reportedId: "sdadsdasd",
            reporterName: "Dr. Ali Djenadi",
            reportedName: "a student",
            date: new Date(2023, 4, 23),
            reason: "spam",
          },
          {
            reporterId: "sadsdasds",
            reportedId: "sdadsdsdasdaddasd",
            reporterName: "Dr. F. Azouaou",
            reportedName: "a student",
            date: new Date(2022, 2, 30),
            reason: "scam",
          },
          {
            reporterId: "sadsdasds",
            reportedId: "sdad342342sdasd",
            reporterName: "Dr. L. Chelouah",
            reportedName: "a student",
            date: new Date(2024, 4, 23),
            reason: "I don't like it",
          },
        ]}
      />
    </main>
  );
}
