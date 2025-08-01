"use client";

import styles from "./users.module.css";
import Avatar from "../avatar";
import { useState } from "react";
import ActionUserPanel from "./actionUserPanel";
import DeletePanel from "../student/Courses/deletePanel";
import { Moderator, Student, Teacher } from "@/database/definitions";

// profile picture should be what exactly ? I suggest to download them on the server to send them later to the component

export default function Users(props: {
  usersType: "students" | "teachers" | "moderators";
  users: Array<{
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
  }>;
}) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAction, setIsAction] = useState<"create" | "edit" | "delete" | null>(null);
  const handleClick = (userEmail: string) => {
    if (!selectedUser) {
      setSelectedUser(userEmail);
    } else {
      if (selectedUser === userEmail) {
        setSelectedUser(null);
      } else {
        setSelectedUser(userEmail);
      }
    }
  };

  return (
    <div className={styles["users"]}>
      <section className={styles["first-section"]}>
        <ul className={styles["first-section__user-list"]}>
          {props.users.map((user) => (
            <li
              onClick={() => handleClick(user.email)}
              key={user.email}
              className={`${styles["first-section__user-list__item"]} ${
                selectedUser === user.email ? styles["appear"] : ""
              }`}
            >
              <Avatar
                userEmail={user.email}
                profilePictureId={user.profilePicture}
              />
              {`${user.firstName} ${user.lastName}`}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles["second-section"]}>
        <button
          onClick={() => setIsAction("create")}
          className={styles["main-action"]}
        >
          Create a User
        </button>
        {selectedUser ? (
          <div className={styles["user-info"]}>
            <h3 className={styles["user-info__header"]}>{`${
              props.users.find((user) => user.email === selectedUser)?.firstName[0]
            }. ${props.users.find((user) => user.email === selectedUser)?.lastName}`}</h3>
            <ul className={styles["user-info__list"]}>
              {/* <li>{`User since ${props.users.find((user) => user.email === selectedUser)?.createdAtYear}`} </li> */}
              <li>{`Phone Number: ${props.users.find((user) => user.email === selectedUser)?.phoneNumber}`}</li>
              <li>{`Email: ${props.users.find((user) => user.email === selectedUser)?.email}`}</li>
            </ul>
            <div className={styles["user-info__actions"]}>
              <button
                onClick={() => setIsAction("delete")}
                className={styles["user-info__actions__delete"]}
              >
                Delete
              </button>
              <button
                onClick={() => setIsAction("edit")}
                className={styles["user-info__actions__edit"]}
              >
                Edit
              </button>
            </div>
          </div>
        ) : null}
      </section>
      {isAction === "delete" ? (
        <DeletePanel
          resourceType={
            (props.usersType.charAt(0).toUpperCase() + props.usersType.slice(1, props.usersType.length - 1)) as
              | "Student"
              | "Teacher"
              | "Moderator"
              | "Course"
              | "Session"
          }
          resourceName={`${props.users.find((user) => user.email === selectedUser)?.firstName[0]}. ${
            props.users.find((user) => user.email === selectedUser)?.lastName
          }`}
          setIsForm={setIsAction}
        />
      ) : null}
      {isAction === "create" ? (
        <ActionUserPanel
          usersType={props.usersType}
          actionType="Create"
          setIsAction={setIsAction}
          userData={props.users.find((user) => user.email === selectedUser)!}
        />
      ) : null}
      {isAction === "edit" ? (
        <ActionUserPanel
          usersType={props.usersType}
          actionType="Edit"
          setIsAction={setIsAction}
          userData={props.users.find((user) => user.email === selectedUser)!}
        />
      ) : null}
    </div>
  );
}
