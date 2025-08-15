"use client";
import styles from "./settings.module.css";
import { useState } from "react";
import LogOutIcon from "../icons/logOutIcon";
import DarkModeIcon from "../icons/darkModeIcon";
import LogOutPanel from "./logOutPanel";

export default function Settings() {
  const [panel, setPanel] = useState<"logOut" | null>(null);

  return (
    <>
      <section className={styles["section"]}>
        <h3>Theme</h3>
        <ul className={styles["list"]}>
          <li className={styles["listItem"]}>
            <button>
              <DarkModeIcon /> Switch to Dark Mode
            </button>
          </li>
        </ul>
      </section>
      <section className={styles["section"]}>
        <h3>Account</h3>
        <ul className={styles["list"]}>
          <li className={styles["listItem"]}>
            <button onClick={() => setPanel("logOut")}>
              <LogOutIcon />
              Log out
            </button>
          </li>
        </ul>
      </section>

      {panel === "logOut" ? <LogOutPanel setPanel={setPanel} /> : null}
    </>
  );
}
