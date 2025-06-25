"use server";
import * as z from "zod/v4";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { createUser, getUserByEmail, isUserExistsWith } from "../database/db";
import { uploadFile } from "@/database/b2";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function register(previousState: any, formData: FormData) {
  console.log(formData);
  const userType = formData.get("userType");
  const profilePic = formData.get("profilePic");
  const cv = formData.get("cv");
  const diploma = formData.get("diploma");

  console.log(`FILE TYPE: ${typeof profilePic}`);
  console.log(`FILE INSTANCE OF FILE: ${profilePic instanceof File}`);

  if (!(profilePic instanceof File) || profilePic.size === 0) {
    return "Profile Pic is missing.";
  }
  if (userType === "teacher") {
    if (!(cv instanceof File) || cv.size === 0) return "CV is missing.";
    if (!(diploma instanceof File) || diploma.size === 0) return "Diploma is missing.";
  }

  const User = z.object({
    firstName: z.string().nonempty().trim(),
    lastName: z.string().nonempty().trim(),
    userType: z.enum(["student", "teacher"]),
    birthDate: z.coerce.date().max(new Date()),
    phoneNumber: z.coerce.number(),
    bio: z.string().trim(),
    address: z.string().trim(),
    email: z.string().email().nonempty().trim(),
    password: z.string().nonempty().trim(),
    profilePic: z.any(),
    cv: z.any(),
    diploma: z.any(),
  });

  const result = User.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    userType: formData.get("userType"),
    birthDate: formData.get("birthDate"),
    phoneNumber: formData.get("phoneNumber"),
    bio: formData.get("bio"),
    address: formData.get("address"),
    email: formData.get("email"),
    password: formData.get("password"),
    profilePic: formData.get("profilePic"),
    cv: formData.get("cv"),
    diploma: formData.get("diploma"),
  });
  if (!result.success) {
    console.log(result.error.message);
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

  const profilePicArrayBuffer = await profilePic.arrayBuffer();
  const profilePicBuffer = Buffer.from(profilePicArrayBuffer);
  let profilePicId: string;

  try {
    profilePicId = await uploadFile(profilePicBuffer, profilePic.name, String(profilePic.size), profilePic.type);
    console.log(`RESULT OF UPLOADING PROFILE PIC \n:`, profilePicId);
  } catch (err) {
    console.error(err);
    return "Could not upload profile pic. Try again.";
  }

  let cvId: string = "";
  let diplomaId: string = "";

  if (user.userType === "teacher" && cv instanceof File && diploma instanceof File) {
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

  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.userType,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const { password, ...userData } = user;
    await createUser(user.userType, {
      ...userData,
      pwd: hashedPassword,
      refreshToken: refreshToken,
      phoneNumber: String(userData.phoneNumber),
      profilePic: profilePicId,
      cv: cvId,
      diploma: diplomaId,
    });
  } catch (err: any) {
    console.error(err.message);
    return "Could not create user. Try again!";
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
  });

  console.log("Server Aciton run and finished!");

  redirect(`/${user.userType}`);
}

export async function login(previousState: any, formData: FormData) {
  console.log(formData);

  const User = z.object({
    email: z.email().nonempty().trim(),
    password: z.string().nonempty().trim(),
  });

  const result = User.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    console.log(result.error.message);
    return "Entries not valid.";
  }
  console.log("No errors!");
  const user = result.data;
  let userInDb;
  try {
    userInDb = await getUserByEmail(user.email);
  } catch (err: any) {
    console.error(err.message);
    return "Could not search for users. Try again!";
  }

  if (!userInDb) {
    console.error("No user with this email.");
    return "No users with this email.";
  }

  const isPasswordCorrect = await bcrypt.compare(user.password, userInDb.pwd);
  if (!isPasswordCorrect) {
    console.error("Password incorrect.");
    return "Password incorrect.";
  }

  const refreshToken = jwt.sign(
    {
      email: userInDb.email,
      role: userInDb.type,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "10m" }
  );

  const cookieStore = await cookies();
  cookieStore.set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
  });
  console.log(userInDb);
  console.log("Server Aciton run and finished!");

  redirect(`/${userInDb.type}`);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("refreshToken");
  redirect("/login");
}
