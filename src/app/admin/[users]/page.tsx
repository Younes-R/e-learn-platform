import styles from "./page.module.css";
import Users from "@/ui/admin/users";

export default async function Page({ params }: { params: Promise<{ users: string }> }) {
  const { users } = await params;
  return (
    <main className={styles.main}>
      <h2>{users.charAt(0).toUpperCase() + users.slice(1)}</h2>
      <Users
        users={[
          {
            firstName: "Ali",
            lastName: "Djenadi",
            phoneNumber: "1234567899",
            email: "djenadi@estin.dz",
            profilePicture: "sd",
            createdAtYear: 2019,
          },
          {
            firstName: "Salim",
            lastName: "Benslimane",
            phoneNumber: "1234567888",
            email: "benslimane@estin.dz",
            profilePicture: "sddsad",
            createdAtYear: 2020,
          },
          {
            firstName: "Leila",
            lastName: "Chelouah",
            phoneNumber: "1234567877",
            email: "chelouah@estin.dz",
            profilePicture: "sd",
            createdAtYear: 2022,
          },
        ]}
      />
    </main>
  );
}
