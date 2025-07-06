"use client";

import styles from "./users.module.css";
import Avatar from "../avatar";
import { useState } from "react";
import EditUserPanel from "./editUserPanel";
import DeletePanel from "../student/Courses/deletePanel";

// profile picture should be what exactly ? I suggest to download them on the server to send them later to the component
export default function Users(props: {
  users: Array<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profilePicture: string;
    createdAtYear: number;
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
              <Avatar />
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
              <li>{`User since ${props.users.find((user) => user.email === selectedUser)?.createdAtYear}`} </li>
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
          resourceType="User"
          resourceName={`${props.users.find((user) => user.email === selectedUser)?.firstName[0]}. ${
            props.users.find((user) => user.email === selectedUser)?.lastName
          }`}
          setIsForm={setIsAction}
        />
      ) : null}
    </div>
  );
}
