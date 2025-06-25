"use client";
import { register } from "@/actions/auth";
import { useActionState, useState } from "react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined);
  const [type, setType] = useState("teacher");

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
    >
      <div>
        <label htmlFor="first-name">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="first-name"
        />
      </div>
      <div>
        <label htmlFor="last-name">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="last-name"
        />
      </div>
      <div>
        <label>User Type:</label>
        <div>
          <label htmlFor="user-type-student">Student</label>
          <input
            type="radio"
            name="userType"
            id="user-type-student"
            value="student"
            checked={type === "student"}
            onChange={() => setType("student")}
          />
          <label htmlFor="user-type-teacher">Teacher</label>
          <input
            type="radio"
            name="userType"
            id="user-type-teacher"
            value="teacher"
            checked={type === "teacher"}
            onChange={() => setType("teacher")}
          />
        </div>
      </div>
      <div>
        <label htmlFor="birth-date">Birth Date:</label>
        <input
          type="date"
          name="birthDate"
          id="birth-date"
        />
      </div>
      <div>
        <label htmlFor="phone-number">Phone Number:</label>
        <input
          type="number"
          name="phoneNumber"
          id="phone-number"
        />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea
          name="bio"
          id="bio"
          cols={30}
          rows={10}
        ></textarea>
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          name="address"
          id="address"
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
        />
      </div>
      <div>
        <label htmlFor="profile-pic">Profile Pic:</label>
        <input
          type="file"
          name="profilePic"
          id="profile-pic"
        />
      </div>
      {type === "teacher" ? (
        <>
          <div>
            <label htmlFor="cv">CV: </label>
            <input
              type="file"
              name="cv"
              id="cv"
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
      <div
        style={{
          // backgroundColor: "gold",
          justifyContent: "flex-end",
          gap: "1em",
        }}
      >
        <button type="submit">Register</button>
        <button type="reset">Reset</button>
      </div>
      {state ? <p style={{ color: "red" }}>{state}</p> : null}
    </form>
  );
}
