import styles from "./page.module.css";
import LoginForm from "@/ui/auth/loginForm";

export default function Page() {
  return (
    <>
      <main className={styles.main}>
        <section className={styles["login"]}>
          <h1>Login Form</h1>
          <LoginForm />
        </section>
      </main>
    </>
  );
}
