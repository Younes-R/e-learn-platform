import styles from "./avatar.module.css";

import Link from "next/link";

export default function Avatar() {
  return (
    <Link
      className={styles.link}
      href="/common/profile/dsadsa"
    ></Link>
  );
}
