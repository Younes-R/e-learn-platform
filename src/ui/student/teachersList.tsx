import styles from "./teachersList.module.css";
import Avatar from "../avatar";

export default function TeachersList(props: {
  usersData: Array<{ first_name: string; last_name: string; email: string; profile_pic: string }>;
}) {
  return (
    <ul className={styles.teachersList}>
      {props.usersData.map((user) => (
        <li>
          <Avatar
            userEmail={user.email}
            profilePictureId={user.profile_pic}
          />
          {`${user.first_name} ${user.last_name}`}
        </li>
      ))}
    </ul>
  );
}
