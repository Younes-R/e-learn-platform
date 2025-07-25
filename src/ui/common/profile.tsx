"use client";

import styles from "./profile.module.css";
import Image from "next/image";
import Link from "next/link";
import CourseCard from "./courseCard";
import ReportPanel from "./reportPanel";
import { useState } from "react";

export default function Profile() {
  const [isAction, setIsAction] = useState<"edit" | "report" | null>(null);

  return (
    <div className={styles.profile}>
      <div className={styles["first-section"]}>
        <section className={styles["intro"]}>
          {/* <h3 className={styles["intro__header"]}>Profile Name</h3> */}
          <div className={styles["intro__body"]}>
            <figure className={styles["intro__body__figure"]}>
              <Image
                src={`/api/media/4_z96f6bfac163300a896490e1b_f105237b090aad1dd_d20250625_m145631_c003_v0312028_t0013_u01750863391954`}
                alt="Profile Picture"
                width={160}
                height={160}
              />
              <figcaption>Teacher</figcaption>
            </figure>
            <div className={styles["intro__body__main"]}>
              <p>
                {" "}
                Welcome ! I am Dr. Ali Djenadi. I am currently a teacher on ESTIN “Ecole Nationale supérieure en
                Sciences et Technologies de l'Informatique ”, and before on A. Mira University at Bejaia. I have A
                Doctorat on Electronics, the module I am currently responsible for on ESTIN.
              </p>
              <ul className={styles["intro__body__main__list"]}>
                <li>Courses: 23</li>
                <li>Sessions: 56</li>
              </ul>
            </div>
          </div>
        </section>
        <section className={styles["courses"]}>
          <div className={styles["courses__header"]}>
            <h3>Courses</h3>
            <Link href={"/student/courses"}>See All</Link>
            {/* so /courses?teacher=teacherName, right ? it should be like this */}
          </div>
          <ul className={styles["courses__list"]}>
            <CourseCard />
            <CourseCard />
          </ul>
        </section>
      </div>
      <div className={styles["second-section"]}>
        <div className={styles["academic-info"]}>
          <h3>Academic Info</h3>
          <p>CV: </p>
        </div>
        <div className={styles["contacts-info"]}>
          <h3>Contacts Info</h3>
          <ul>
            <li>Phone Number:</li>
            <li>Email:</li>
          </ul>
        </div>
        <button
          onClick={() => setIsAction("report")}
          className={styles["report-button"]}
        >
          Report Account
        </button>
        <button className={styles["edit-button"]}>Edit Profile</button>
      </div>
      {isAction === "report" ? (
        <ReportPanel
          profileEmail="sdads"
          setIsAction={setIsAction}
        />
      ) : null}
    </div>
  );
}
