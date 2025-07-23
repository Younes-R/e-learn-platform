import styles from "./teachersList.module.css";
import Avatar from "../avatar";

export default function TeachersList(props: {
  userData: Array<{ firstName: string; lastName: string; email: string; profilePicture: Object }>;
}) {
  return (
    <>
      {props.userData && props.userData.length > 0 ? (
        <ul className={styles.teachersList}>
          {props.userData.map((user) => (
            <li>
              <Avatar
                userEmail={user.email}
                profilePicture={user.profilePicture}
              />
              {`${user.firstName} ${user.lastName}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found to display.</p>
      )}
    </>
  );
}
