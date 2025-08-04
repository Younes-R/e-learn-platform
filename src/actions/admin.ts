"use server";
import * as z from "zod/v4";
import * as bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
import { createUser, getUserByEmail, isUserExistsWith } from "../database/dal/db";
import { uploadFile } from "@/database/b2";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createNewUser(
  previousState: any,
  formData: FormData,
  argUserType: "student" | "teacher" | "moderator"
) {
  console.log(formData);
  //   const userType = formData.get("userType");
  const profilePicture = formData.get("profilePicture");
  const cv = formData.get("cv");
  const diploma = formData.get("diploma");

  console.log(`FILE TYPE: ${typeof profilePicture}`);
  console.log(`FILE INSTANCE OF FILE: ${profilePicture instanceof File}`);

  if (!(profilePicture instanceof File) || profilePicture.size === 0) {
    console.error("Profile Picture is missing.");
    return "Profile Picture is missing.";
  }
  if (argUserType === "teacher") {
    if (!(cv instanceof File) || cv.size === 0) {
      console.error("CV is missing.");
      return "CV is missing.";
    }
    if (!(diploma instanceof File) || diploma.size === 0) {
      console.error("Diploma is missing.");
      return "Diploma is missing.";
    }
  }

  const User = z.object({
    firstName: z.string().nonempty().trim(),
    lastName: z.string().nonempty().trim(),
    password: z.string().nonempty().trim(),
    birthDate: z.coerce.date().max(new Date()),
    email: z.string().email().nonempty().trim(),
    phoneNumber: z.coerce.number(),
    bio: z.string().trim(),
    // address: z.string().trim(),
    profilePicture: z.any(),
    cv: z.any(),
    diploma: z.any(),
  });

  const result = User.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    // userType: formData.get("userType"),
    birthDate: formData.get("birthDate"),
    phoneNumber: formData.get("phoneNumber"),
    bio: formData.get("bio"),
    // address: formData.get("address"),
    email: formData.get("email"),
    password: formData.get("password"),
    profilePicture: formData.get("profilePicture"),
    cv: formData.get("cv"),
    diploma: formData.get("diploma"),
  });
  if (!result.success) {
    console.error(result.error.message);
    return "Entries not valid.";
  }
  console.log("No errors!");
  console.log(result.data);

  const user = result.data;
  let isDublicate;
  try {
    isDublicate = await isUserExistsWith(user.email); // this can throw an error
  } catch (err: any) {
    console.error(err.message);
    return "Could not search for user."; // this needs to have a better err message
  }
  if (isDublicate) return "A user already exists with this email.";

  const profilePicArrayBuffer = await profilePicture.arrayBuffer();
  const profilePicBuffer = Buffer.from(profilePicArrayBuffer);
  let profilePicId: string;

  try {
    profilePicId = await uploadFile(
      profilePicBuffer,
      profilePicture.name,
      String(profilePicture.size),
      profilePicture.type
    );
    console.log(`RESULT OF UPLOADING PROFILE PIC \n:`, profilePicId);
  } catch (err) {
    console.error(err);
    return "Could not upload profile picture. Try again.";
  }

  let cvId: string = "";
  let diplomaId: string = "";

  if (argUserType === "teacher" && cv instanceof File && diploma instanceof File) {
    const cvArrayBuffer = await cv.arrayBuffer();
    const cvBuffer = Buffer.from(cvArrayBuffer);

    try {
      cvId = await uploadFile(cvBuffer, cv.name, String(cv.size), cv.type);
      console.log(`RESULT OF UPLOADING CV: \n`, cvId);
    } catch (err) {
      console.error(err);
      return "Could not upload CV. Try again.";
    }

    const diplomaArrayBuffer = await diploma.arrayBuffer();
    const diplomaBuffer = Buffer.from(diplomaArrayBuffer);

    try {
      diplomaId = await uploadFile(diplomaBuffer, diploma.name, String(diploma.size), diploma.type);
      console.log(`RESULT OF UPLOADING DIPLOMA: \n`, diplomaId);
    } catch (err) {
      console.error(err);
      return "Could not upload Diploma. Try again.";
    }
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const { password, ...userData } = user;
    await createUser(argUserType, {
      ...userData,
      pwd: hashedPassword,
      refreshToken: "",
      phoneNumber: String(userData.phoneNumber),
      profilePic: profilePicId,
      cv: cvId,
      diploma: diplomaId,
      address: "",
    });
  } catch (err: any) {
    console.error(err.message);
    return "Could not create user. Try again!";
  }

  console.log("Server Aciton run and finished!");

  revalidatePath(`/admin/${argUserType}s`);
}
