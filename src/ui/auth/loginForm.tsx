"use client";
import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction}>
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
        <button type="submit">Login</button>
        <button type="reset">Reset</button>
      </div>
      {state ? <p style={{ color: "red" }}>{state}</p> : null}
    </form>
  );
}
