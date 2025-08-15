import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <h2>Welcome, Admin!</h2>
      <p>Here, you can check all resources on this application. Choose a resource from the side bar and insepct it! </p>
    </main>
  );
}
