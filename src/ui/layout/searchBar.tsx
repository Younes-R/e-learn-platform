import styles from "./searchBar.module.css";
import Link from "next/link";
import SearchForm from "./searchForm";
import NotificationsIcon from "../icons/notificationsIcon";
import Image from "next/image";

export default function SearchBar() {
  return (
    <header className={styles.header}>
      <SearchForm />
      <div className={styles["header__div"]}>
        <Link
          className={styles["header__account-link"]}
          href="/common/profile/ffsdfd"
        >
          <Image
            src={`/api/media/4_z96f6bfac163300a896490e1b_f105237b090aad1dd_d20250625_m145631_c003_v0312028_t0013_u01750863391954`}
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
