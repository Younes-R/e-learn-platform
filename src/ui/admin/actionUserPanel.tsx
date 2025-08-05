"use client";
import styles from "./actionUserPanel.module.css";
import { useActionState } from "react";
import { createUser } from "@/actions/admin";

function createStudent(previousState: any, formData: FormData) {
  return createUser(previousState, formData, "student");
}
function createTeacher(previousState: any, formData: FormData) {
  return createUser(previousState, formData, "teacher");
}
function createModerator(previousState: any, formData: FormData) {
  return createUser(previousState, formData, "moderator");
}

export default function ActionUserPanel(props: {
  actionType: "Create" | "Edit";
  usersType: "students" | "teachers" | "moderators";
  setIsAction: Function;
  userData: {
    firstName: string;
    lastName: string;
    birthDate: Date;
    phoneNumber: string;
    email: string;
    profilePicture: string;
    bio: string;
    createdAtYear?: number;
    address?: string;
    cv?: string;
    diploma?: string;
  } | null;
}) {
  const createUser =
    props.usersType === "students" ? createStudent : props.usersType === "teachers" ? createTeacher : createModerator;
  const [state, formAction, isPending] = useActionState(createUser, undefined);

  return (
    <section className={styles["delete-panel"]}>
      <form
        className={styles["delete-panel__form"]}
        action={formAction}
        encType="multipart/form-data"
      >
        <div className={styles["delete-panel__form__header"]}>
          <h3>
            {props.actionType}{" "}
            {props.usersType.charAt(0).toUpperCase() + props.usersType.slice(1, props.usersType.length - 1)} Profile
          </h3>
          <div className={styles["delete-panel__form__header__actions"]}>
            <button className={styles["delete-panel__form__header__actions__edit"]}>Create</button>
            <button
              onClick={() => props.setIsAction(null)}
              className={styles["delete-panel__form__header__actions__cancel"]}
            >
              Cancel
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="first-name">
            First Name:
            <input
              type="text"
              name="firstName"
              id="first-name"
              defaultValue={props.actionType === "Edit" && props.userData ? props.userData.firstName : ""}
            />
          </label>
          <label htmlFor="last-name">
            Last Name:
            <input
              type="text"
              name="lastName"
              id="last-name"
              defaultValue={props.actionType === "Edit" && props.userData ? props.userData.lastName : ""}
            />
          </label>
        </div>
        {props.actionType === "Create" ? (
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              name="password"
              id="password"
            />
          </div>
        ) : null}
        <div>
          <label htmlFor="birthDate">Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            id="birth-date"
            defaultValue={
              props.actionType === "Edit" && props.userData
                ? new Date(props.userData.birthDate).toISOString().split("T")[0]
                : ""
            }
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        {props.usersType === "teachers" ? (
          <>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                name="location"
                id="location"
                defaultValue={props.actionType === "Edit" && props.userData ? props.userData.address : ""}
              />
            </div>
            <div>
              <label htmlFor="curriculum-vitae">Curriculum Vitae:</label>
              <input
                type="file"
                name="curriculumVitae"
                id="curriculum-vitae"
              />
            </div>
            <div>
              <label htmlFor="diploma">Diploma:</label>
              <input
                type="file"
                name="diploma"
                id="diploma"
              />
            </div>
          </>
        ) : null}
        {/* </div>
        <div> */}
        <div className={styles["delete-panel__form__email-phone-div"]}>
          <label htmlFor="email">
            Email:
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={props.actionType === "Edit" && props.userData ? props.userData.email : ""}
            />
          </label>
          <label htmlFor="phone-number">
            Phone Number:
            <input
              type="number"
              name="phoneNumber"
              id="phone-number"
              defaultValue={props.actionType === "Edit" && props.userData ? props.userData.phoneNumber : ""}
            />
          </label>
        </div>
        <div>
          <label htmlFor="profile-picture">Add Profile Picture:</label>
          <input
            type="file"
            name="profilePicture"
            id="profile-picture"
          />
        </div>
        <div className={styles["delete-panel__form__biography"]}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            name="bio"
            id="bio"
            cols={67}
            rows={10}
            defaultValue={props.actionType === "Edit" && props.userData ? props.userData.bio : ""}
          ></textarea>
        </div>

        {state ? <p style={{ color: "red" }}>{state}</p> : null}
      </form>
    </section>
  );
}
