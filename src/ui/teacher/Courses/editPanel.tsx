"use client";
import { CourseDataSegment, CoursePlus } from "@/database/definitions";
import styles from "./editPanel.module.css";
import { useState } from "react";

export default function EditPanel(props: {
  setIsForm: Function;
  selectedCourseData: CourseDataSegment & {
    price?: number;
    module?: string;
    level?: string;
    documents?: Array<{ title: string; uri: string }>; // we should fix types later
  };
}) {
  const [files, setFiles] = useState<Array<File>>([]);
  return (
    <section className={styles["create-panel"]}>
      <form
        className={styles["create-panel__form"]}
        action=""
      >
        <div className={styles["create-panel__form__heading"]}>
          <h3>Edit Course</h3>
          <div className={styles["create-panel__form__heading__actions"]}>
            <button>Edit</button>
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
              defaultValue={props.selectedCourseData.title}
            />
          </label>
          <label htmlFor="price">
            Price:
            <input
              type="number"
              name="price"
              id="price"
              defaultValue={props.selectedCourseData.price}
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
              defaultValue={props.selectedCourseData.module}
            />
          </label>
          <label htmlFor="level">
            Level:
            <input
              type="text"
              name="level"
              id="level"
              defaultValue={props.selectedCourseData.level}
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
            defaultValue={props.selectedCourseData.description}
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
                  setFiles([...files, ...e.target.files]);
                }
              }}
            />
          </label>
          <ul className={styles["create-panel__files-list"]}>
            {props.selectedCourseData.documents?.map((document) => (
              <li>
                <span>{document.title.length < 50 ? document.title : document.title.substring(0, 50) + `...`} </span>
                <button
                  className={styles["create-panel__files-list__delete-button"]}
                  onClick={(e) => {
                    e.preventDefault();
                    // deleteDocument(document.id) this is a server action. update: no do not use a server function here. if you do it, what would be the benefit from edit button ? it is the one supposed to fire any action to the server. the form should fire only action to the server, not different multiple ones seperately and also, by pressing the edit button would this mean you want to delete the 'already deleted' doc again ?
                    // make this button add the doc uri to an array called 'deleted docs' that gets sent to the server with the rest of the form data. deleted docs is a state (can you put it in a simple variable ?)
                    // also there is bug, when pressing the button, the form submits. we do not want this
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
            {files.map((file) => (
              <li key={file.name + file.size}>
                <span>{file.name.length < 50 ? file.name : file.name.substring(0, 50) + `...`}</span>
                <button className={styles["create-panel__files-list__delete-button"]}>Delete</button>
                {/* this button should delete the newly uploaded file from our file array, just that */}
              </li>
            ))}
          </ul>
        </div>
      </form>
    </section>
  );
}
