import styles from "./avatar.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Avatar(props: { userEmail: string; profilePicture: Object }) {
  return (
    <Link
      className={styles.link}
      href={`/common/profile/${props.userEmail}`}
    >
      <Image
        src={"/wallpaperflare.com_wallpaper(5).jpg"}
        alt="Profile Picture"
        width={35}
        height={35}
      />
    </Link>
  );
}
