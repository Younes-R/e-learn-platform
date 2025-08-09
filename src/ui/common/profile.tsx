"use client";

import styles from "./profile.module.css";
import Image from "next/image";
import Link from "next/link";
import CourseCard from "./courseCard";
import ReportPanel from "./reportPanel";
import { useState } from "react";

export default function Profile(props: {
  profileInfo:
    | {
        userData: {
          firstName: string;
          lastName: string;
          bio: string;
          type: string;
          cv: string;
          diploma: string;
          phoneNumber: string;
          profilePicture: string;
        };
        coursesData: null;
        coursesCount: null;
        sessionsCount: null;
      }
    | {
        userData: {
          firstName: string;
          lastName: string;
          bio: string;
          type: string;
          cv: string;
          diploma: string;
          phoneNumber: string;
          profilePicture: string;
        };
        coursesData: Array<{ cid: string; title: string; description: string; price: number }> | null;
        coursesCount: number;
        sessionsCount: number;
      };
  profileEmail: string;
  userEmail: string;
}) {
  const [isAction, setIsAction] = useState<"edit" | "report" | null>(null);
  const { userData, coursesData, coursesCount, sessionsCount } = props.profileInfo;
  console.log(`PROFILE USER EMAIL:`, props.userEmail);
  console.log(`PROFILE PROFILE EMAIL:`, props.profileEmail);
  return (
    <div className={styles.profile}>
      <div className={styles["first-section"]}>
        <section className={styles["intro"]}>
          {/* <h3 className={styles["intro__header"]}>Profile Name</h3> */}
          <div className={styles["intro__body"]}>
            <figure className={styles["intro__body__figure"]}>
              <Image
                src={`/api/media/${userData.profilePicture}`}
                alt="Profile Picture"
                width={125}
                height={125}
              />
              <figcaption>{`${userData.type[0].toUpperCase() + userData.type.substring(1)}`}</figcaption>
            </figure>
            <div className={styles["intro__body__main"]}>
              <p>{`${userData.bio}`}</p>
              {userData.type === "teacher" ? (
                <ul className={styles["intro__body__main__list"]}>
                  <li>{`Courses: ${coursesCount}`}</li>
                  <li>{`Sessions: ${sessionsCount}`}</li>
                </ul>
              ) : null}
            </div>
          </div>
        </section>
        {userData.type === "teacher" ? (
          <section className={styles["courses"]}>
            <div className={styles["courses__header"]}>
              <h3>Courses</h3>
              {coursesData && coursesData.length > 0 ? <Link href={"/student/courses"}>See All</Link> : null}
              {/* so /courses?teacher=teacherName, right ? it should be like this */}
            </div>
            {coursesData && coursesData.length > 0 ? (
              <ul className={styles["courses__list"]}>
                {coursesData.map((course) => (
                  <CourseCard courseData={course} />
                ))}
              </ul>
            ) : (
              <p>This teacher did not post any courses.</p>
            )}
          </section>
        ) : null}
      </div>
      <div className={styles["second-section"]}>
        {userData.type === "teacher" ? (
          <div className={styles["academic-info"]}>
            <h3>Academic Info</h3>
            <p>
              CV: <a href={`/api/media/${userData.cv}?doc=true`}>Click to download.</a>{" "}
            </p>
          </div>
        ) : null}
        <div className={styles["contacts-info"]}>
          <h3>Contacts Info</h3>
          <ul>
            <li>{`Phone Number: ${userData.phoneNumber}`}</li>
            <li>{`Email: ${props.profileEmail}`}</li>
          </ul>
        </div>
        {props.userEmail !== props.profileEmail ? (
          <button
            onClick={() => setIsAction("report")}
            className={styles["report-button"]}
          >
            Report Account
          </button>
        ) : null}
        {props.userEmail === props.profileEmail ? (
          <button className={styles["edit-button"]}>Edit Profile</button>
        ) : null}
      </div>
      {isAction === "report" ? (
        <ReportPanel
          profileEmail={props.profileEmail}
          setIsAction={setIsAction}
        />
      ) : null}
    </div>
  );
}
