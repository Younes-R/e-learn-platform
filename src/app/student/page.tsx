import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["student"]);
  return (
    <>
      <header>
        <h1>Student Page</h1>
        <main>
          <p>Hello Student !</p>
        </main>
      </header>
    </>
  );
}
