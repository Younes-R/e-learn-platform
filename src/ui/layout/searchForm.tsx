"use client";

import styles from "./searchForm.module.css";
import { useState } from "react";
import FilterIcon from "../icons/filterIcon";

export default function SearchForm() {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const [teacherToggle, setTeacherToggle] = useState<boolean>(false);
  const [courseToggle, setCourseToggle] = useState<boolean>(false);
  const [sessionToggle, setSessionToggle] = useState<boolean>(false);

  return (
    <form
      className={styles["search-form"]}
      action=""
    >
      <div className={styles["search-form__principal-search"]}>
        <input
          className={styles["search-form__principal-input"]}
          type="text"
          placeholder="Search..."
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsToggled(!isToggled);
          }}
          className={styles["search-form__toggle-button"]}
        >
          <FilterIcon />
        </button>
      </div>
      {isToggled ? (
        <div className={styles["search-form__extended-part"]}>
          <div>
            <label className={styles["search-form__extended-part__search-label"]}>
              Search:
              <p>
                <label
                  className={`${styles["search-form__extended-part__principal-label__teacher-label"]} ${
                    teacherToggle ? styles["search-form__extended-part__principal-label__label--toggled"] : ""
                  } `}
                  htmlFor="teacher-option"
                >
                  Teacher
                  <input
                    type="checkbox"
                    name="resourceOptions"
                    value="teacher"
                    id="teacher-option"
                    onChange={() => {
                      console.log("teacher-option toggled!");
                      setTeacherToggle(!teacherToggle);
                    }}
                    checked={teacherToggle}
                  />
                </label>
                <label
                  className={`${styles["search-form__extended-part__principal-label__course-label"]} ${
                    courseToggle ? styles["search-form__extended-part__principal-label__label--toggled"] : ""
                  }`}
                  htmlFor="course-option"
                >
                  Course
                  <input
                    type="checkbox"
                    name="resourceOptions"
                    value="course"
                    id="course-option"
                    onChange={() => {
                      console.log("course-option toggled!");
                      setCourseToggle(!courseToggle);
                    }}
                    checked={courseToggle}
                  />
                </label>
                <label
                  className={`${styles["search-form__extended-part__principal-label__session-label"]} ${
                    sessionToggle ? styles["search-form__extended-part__principal-label__label--toggled"] : ""
                  }`}
                  htmlFor="session-option"
                >
                  Session
                  <input
                    type="checkbox"
                    name="resourceOptions"
                    value="session"
                    id="session-option"
                    onChange={() => {
                      console.log("session-option toggled!");
                      setSessionToggle(!sessionToggle);
                    }}
                    checked={sessionToggle}
                  />
                </label>
              </p>
            </label>
            <label
              className={styles["search-form__extended-part__principal-label"]}
              htmlFor="module"
            >
              Module:
              <input
                type="text"
                name="module"
                id="module"
              />
            </label>
          </div>
          {courseToggle || sessionToggle ? (
            <>
              <div>
                <label
                  className={styles["search-form__extended-part__principal-label"]}
                  htmlFor="level"
                >
                  Level:
                  <input
                    type="text"
                    name="level"
                    id="level"
                  />
                </label>
                <label
                  className={styles["search-form__extended-part__principal-label"]}
                  htmlFor="price"
                >
                  Price:
                  <input
                    type="number"
                    name="price"
                    id="price"
                  />
                </label>
              </div>
            </>
          ) : null}
          {sessionToggle ? (
            <>
              <div>
                <label
                  className={styles["search-form__extended-part__principal-label"]}
                  htmlFor="type"
                >
                  Type:
                  <select
                    name="type"
                    id="type"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </label>
                <label
                  className={styles["search-form__extended-part__principal-label"]}
                  htmlFor="location"
                >
                  Location:
                  <input
                    type="text"
                    name="location"
                    id="location"
                  />
                </label>
              </div>{" "}
            </>
          ) : null}
          <div className={styles["search-form__extended-part__main-action__div"]}>
            <button className={styles["search-form__extended-part__main-action__div__button"]}>Apply</button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
