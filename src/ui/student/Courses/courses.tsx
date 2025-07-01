"use client";

import { useState } from "react";
import styles from "./courses.module.css";
import CoursesList from "./coursesList";
import ActionPanel from "./actionPanel";
import CreatePanel from "./createPanel";
import { CoursesDataSegments } from "@/database/definitions";

export default function Courses(props: { coursesDataSegments: CoursesDataSegments }) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isForm, setIsForm] = useState<"create" | "edit" | "delete" | null>(null);
  return (
    <div className={styles.courses}>
      <CoursesList
        CoursesDataSegments={props.coursesDataSegments}
        handleClick={setSelectedCourse}
        selectedCourse={selectedCourse}
      />
      <section className={styles["second-row"]}>
        <button
          onClick={() => setIsForm("create")}
          className={styles["second-row__main-action"]}
        >
          Add Course
        </button>
        {selectedCourse ? (
          <div className={styles["second-row__course-info"]}>
            <h3>{props.coursesDataSegments.find((course) => course.cid === selectedCourse)?.title}</h3>
            <div className={styles["second-row__course-info__description"]}>
              <p>{props.coursesDataSegments.find((course) => course.cid === selectedCourse)?.description}</p>
              <span>
                {props.coursesDataSegments.find((course) => course.cid === selectedCourse)?.enrolledStudentsNumber}{" "}
                students enrolled in
              </span>
            </div>
            <div className={styles["second-row__course-info__actions"]}>
              <button>Edit</button>
              <button onClick={() => setIsForm("delete")}>Delete</button>
            </div>
          </div>
        ) : null}
      </section>
      {isForm === "delete" ? (
        <ActionPanel
          courseName={props.coursesDataSegments.find((course) => course.cid === selectedCourse)?.title!}
          setIsForm={setIsForm}
        />
      ) : null}
      {isForm === "create" ? <CreatePanel setIsForm={setIsForm} /> : null}
    </div>
  );
}
