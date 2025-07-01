import styles from "./searchBar.module.css";
import Link from "next/link";
import NotificationsIcon from "../icons/notificationsIcon";
import Image from "next/image";

export default function SearchBar() {
  return (
    <header className={styles.header}>
      <form
        className={styles["header__form"]}
        action=""
      >
        <input
          type="text"
          placeholder="Search..."
        />
      </form>
      <div className={styles["header__div"]}>
        <Link
          className={styles["header__account-link"]}
          href="/common/profile/ffsdfd"
        >
          <Image
            src={"/720px-Main-Forerunner.png"}
            alt="Profile Picture"
            width={35}
            height={35}
          />
        </Link>
        <button className={styles["header__notifications-button"]}>
          <NotificationsIcon />
        </button>
      </div>
    </header>
  );
}
