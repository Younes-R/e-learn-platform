"use client";
import styles from "./loginForm.module.css";
import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form
      className={styles["form"]}
      action={formAction}
    >
      <div className={styles["form__email-div"]}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
        />
      </div>
      <div className={styles["form__password-div"]}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
        />
      </div>
      <div className={styles["form__actions"]}>
        <button type="submit">Login</button>
        <button type="reset">Reset</button>
      </div>
      {state ? <p style={{ color: "red", paddingLeft: "0em" }}>{state}</p> : null}
    </form>
  );
}
