import { verifyRefreshToken, verifyRoles } from "@/lib/utils";

export default async function Page() {
  await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  return (
    <>
      <header>
        <h1>Teacher Page</h1>
        <main>
          <p>Hello Teacher !</p>
        </main>
      </header>
    </>
  );
}
