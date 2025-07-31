"use client";

import { useState } from "react";
import styles from "./courses.module.css";
import CoursesList from "./coursesList";
import DeletePanel from "./deletePanel";
import CreatePanel from "./createPanel";
import EditPanel from "./editPanel";
import CreateIcon from "@/ui/icons/createIcon";

export default function Courses(props: {
  coursesDataSegments: Array<{
    cid: string;
    title: string;
    description: string;
    enrolledStudentsNumber: number;
    price: number;
    module: string;
    level: string;
    documents: Array<{ title: string; uri: string }>; // we should fix types later
  }> | null;
}) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isForm, setIsForm] = useState<"create" | "edit" | "delete" | null>(null);
  return (
    <div className={styles.courses}>
      {props.coursesDataSegments && props.coursesDataSegments.length > 0 ? (
        <CoursesList
          CoursesDataSegments={props.coursesDataSegments}
          handleClick={setSelectedCourse}
          selectedCourse={selectedCourse}
        />
      ) : (
        <p>You have no courses.</p>
      )}
      <section className={styles["second-row"]}>
        <button
          onClick={() => setIsForm("create")}
          className={styles["second-row__main-action"]}
        >
          <CreateIcon />
          <span>Add Course</span>
        </button>
        {props.coursesDataSegments && props.coursesDataSegments.length > 0 && selectedCourse ? (
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
              <button onClick={() => setIsForm("edit")}>Edit</button>
              <button onClick={() => setIsForm("delete")}>Delete</button>
            </div>
          </div>
        ) : null}
      </section>
      {props.coursesDataSegments && props.coursesDataSegments.length > 0 && isForm === "delete" ? (
        <DeletePanel
          resourceType="Course"
          resourceName={props.coursesDataSegments.find((course) => course.cid === selectedCourse)?.title!}
          setIsForm={setIsForm}
        />
      ) : null}
      {isForm === "create" ? <CreatePanel setIsForm={setIsForm} /> : null}
      {props.coursesDataSegments && props.coursesDataSegments.length > 0 && isForm === "edit" ? (
        <EditPanel
          setIsForm={setIsForm}
          selectedCourseData={props.coursesDataSegments.find((course) => course.cid === selectedCourse)!}
        />
      ) : null}
    </div>
  );
}
