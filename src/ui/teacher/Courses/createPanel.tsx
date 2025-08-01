"use client";
import { useState } from "react";
import styles from "./createPanel.module.css";

export default function CreatePanel(props: { setIsForm: Function }) {
  const [files, setFiles] = useState<Array<File>>([]);
  return (
    <section className={styles["create-panel"]}>
      <form
        className={styles["create-panel__form"]}
        action=""
      >
        <div className={styles["create-panel__form__heading"]}>
          <h3>Create a New Course</h3>
          <div className={styles["create-panel__form__heading__actions"]}>
            <button>Create</button>
            <button onClick={() => props.setIsForm(null)}>Cancel</button>
          </div>
        </div>
        <div>
          <label htmlFor="title">
            Title:
            <input
              type="text"
              name="title"
              id="title"
            />
          </label>
          <label htmlFor="price">
            Price:
            <input
              type="number"
              name="price"
              id="price"
            />
          </label>
        </div>
        <div>
          <label htmlFor="module">
            Module:
            <input
              type="text"
              name="module"
              id="module"
            />
          </label>
          <label htmlFor="level">
            Level:
            <input
              type="text"
              name="level"
              id="level"
            />
          </label>
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            cols={65}
            rows={10}
          ></textarea>
        </div>
        <div>
          <label htmlFor="files">
            Add Documents:
            <input
              type="file"
              name="files"
              id="files"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files).filter(
                    (file) => !files.some((existingFile) => existingFile.name === file.name)
                  );
                  setFiles([...files, ...newFiles]);
                }
              }}
            />
          </label>
          <ul className={styles["create-panel__files-list"]}>
            {files.map((file) => (
              <li key={file.name + file.size}>
                {file.name.length < 50 ? file.name : file.name.substring(0, 50) + `...`}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </section>
  );
}
