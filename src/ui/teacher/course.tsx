"use client";

import styles from "./course.module.css";
import Avatar from "../avatar";
import Link from "next/link";
import DeletePanel from "./Courses/deletePanel";
import { useState } from "react";
import EditPanel from "./Courses/editPanel";

export default function Course(props: {
  courseData: {
    course: {
      cid: string;
      title: string;
      firstName: string;
      lastName: string;
      description: string;
      email: string;
    };
    documents: Array<{ title: string; fileId: string }> | null;
    studentsEnrolledIn: Array<{ firstName: string; lastName: string; email: string; profilePicture: string }> | null;
  };
  userEmail: string;
  userRole: string;
}) {
  const [isForm, setIsForm] = useState<"edit" | "delete" | null>(null);

  return (
    <div className={styles["course"]}>
      <section className={styles["first-section"]}>
        <div className={styles["first-part"]}>
          <div className={styles["first-part__div"]}>
            <p>{props.courseData.course?.description}</p>
            <ul>
              <li>
                By {props.courseData.course?.firstName[0].toUpperCase()}.{" "}
                {`${
                  props.courseData.course?.lastName[0].toUpperCase() + props.courseData.course?.lastName.substring(1)
                }`}
              </li>
              <li>{props.courseData.studentsEnrolledIn?.length} students enrolled in</li>
            </ul>
          </div>
        </div>
        <div className={styles["documents"]}>
          <h2>Documents</h2>
          {props.courseData.documents && props.courseData.documents.length > 0 ? (
            <ul>
              {props.courseData.documents.map((document) => (
                <li key={document.fileId}>
                  <span>
                    <Link href={`/api/media/${document.fileId}?doc=true`}>{document.title}</Link>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents found in the course.</p>
          )}
        </div>
        {props.userRole === "teacher" && props.userEmail === props.courseData.course.email ? (
          <div className={styles["students"]}>
            <h2>Students Enrolled In</h2>
            {props.courseData.studentsEnrolledIn && props.courseData.studentsEnrolledIn.length > 0 ? (
              <ul className={styles["students__list"]}>
                {props.courseData.studentsEnrolledIn.map((student) => (
                  <li className={styles["students__list__item"]}>
                    <Avatar
                      userEmail={student.email}
                      profilePictureId={student.profilePicture}
                    />
                    {`${student.firstName[0].toUpperCase()}. ${
                      student.lastName[0].toUpperCase() + student.lastName.substring(1)
                    }`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled yet in this course.</p>
            )}
          </div>
        ) : null}
      </section>
      {props.userRole === "teacher" && props.userEmail === props.courseData.course.email ? (
        <section className={styles["second-section"]}>
          <button className={styles["edit"]}>Edit Course</button>
          <button
            onClick={() => setIsForm("delete")}
            className={styles["delete"]}
          >
            Delete Course
          </button>
        </section>
      ) : null}
      {isForm === "delete" ? (
        <DeletePanel
          resourceType="Course"
          resourceName={props.courseData.course.title}
          resourceId={props.courseData.course.cid}
          setIsForm={setIsForm}
        />
      ) : null}
    </div>
  );
}
