"use client";

import styles from "./searchForm.module.css";
import { useState } from "react";
import FilterIcon from "../icons/filterIcon";

export default function SearchForm() {
  const [isToggled, setIsToggled] = useState<boolean>(false);

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
              <label
                className={styles["search-form__extended-part__principal-label__teacher-label"]}
                htmlFor="teacher-option"
              >
                Teacher
                <input
                  type="checkbox"
                  name="resourceOptions"
                  value="teacher"
                  id="teacher-option"
                  onChange={() => console.log("teacher-option toggled!")}
                />
              </label>
              <label
                className={styles["search-form__extended-part__principal-label__course-label"]}
                htmlFor="course-option"
              >
                Course
                <input
                  type="checkbox"
                  name="resourceOptions"
                  value="course"
                  id="course-option"
                  onChange={() => console.log("course-option toggled!")}
                />
              </label>
              <label
                className={styles["search-form__extended-part__principal-label__session-label"]}
                htmlFor="session-option"
              >
                Session
                <input
                  type="checkbox"
                  name="resourceOptions"
                  value="session"
                  id="session-option"
                  onChange={() => console.log("session-option toggled!")}
                />
              </label>
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
          <div>
            <label
              className={styles["search-form__extended-part__principal-label"]}
              htmlFor="type"
            >
              Type:
              <input
                type="text"
                name="type"
                id="type"
              />
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
          </div>
        </div>
      ) : null}
    </form>
  );
}
