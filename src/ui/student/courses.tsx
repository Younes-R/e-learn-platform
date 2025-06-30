"use client";

import { useState } from "react";
import styles from "./courses.module.css";
import CoursesList from "./coursesList";
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
        <button className={styles["second-row__main-action"]}>Add Course</button>
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
              <button>Delete</button>
            </div>
          </div>
        ) : null}
      </section>
      <section className={styles["action-panel"]}>
        <div className={styles["action-panel__modal"]}>
          <h3>Delete This Course?</h3>
          <p>Are you sure you want to delete this course [enter course name]?</p>
          <div className={styles["action-panel__modal__actions"]}>
            <button className={styles["action-panel__modal__actions__cancel"]}>Cancel</button>
            <button className={styles["action-panel__modal__actions__delete"]}>Delete</button>
          </div>
        </div>
      </section>
    </div>
  );
}
