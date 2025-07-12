import styles from "./page.module.css";
import Users from "@/ui/admin/users";

// users: 'students' | 'teachers' | 'moderators' it should be like that
export default async function Page({ params }: { params: Promise<{ users: "students" | "teachers" | "moderators" }> }) {
  const { users } = await params;
  return (
    <main className={styles.main}>
      <h2>{users.charAt(0).toUpperCase() + users.slice(1)}</h2>
      <Users
        usersType={users}
        users={[
          {
            firstName: "Ali",
            lastName: "Djenadi",
            birthDate: new Date(Date.UTC(1972, 4, 14)),
            phoneNumber: "1234567899",
            email: "djenadi@estin.dz",
            profilePic: "sd",
            bio: "Hello, I am a high education teacher, specialized in Electronics.",
            createdAtYear: 2019,
            address: "Bejaia, Bejaia, Algeria",
            cv: "cv uri",
            diploma: "diploma uri",
          },
          {
            firstName: "Salim",
            lastName: "Benslimane",
            birthDate: new Date(Date.UTC(1976, 6, 24)),
            phoneNumber: "1234567888",
            email: "benslimane@estin.dz",
            profilePic: "sddsad",
            bio: "Hello, I am a high education teacher.",
            createdAtYear: 2020,
            address: "Bejaia, Bejaia, Algeria",
            cv: "cv uri",
            diploma: "diploma uri",
          },
          {
            firstName: "Leila",
            lastName: "Chelouah",
            birthDate: new Date(Date.UTC(1980, 2, 29)),
            phoneNumber: "1234567877",
            email: "chelouah@estin.dz",
            profilePic: "sd",
            bio: "Hello, I am a high education teacher.",
            createdAtYear: 2022,
            address: "Borj, Borj, Algeria",
            cv: "cv uri",
            diploma: "diploma uri",
          },
        ]}
      />
    </main>
  );
}
