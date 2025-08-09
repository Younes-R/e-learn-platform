"use server";
import * as z from "zod/v4";
import * as bcrypt from "bcryptjs";
// import * as jwt from "jsonwebtoken";
import {
  createUser as dbCreateUser,
  updateUser as dbUpdateUser,
  getUserByEmail,
  isUserExistsWith,
  deleteUser as dbDeleteUser,
} from "../database/dal/db";
import { uploadFile } from "@/database/b2";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// firstName: string;
//   lastName: string;
//   birthDate: Date;
//   email: string;
//   phoneNumber: string;
//   profilePicture: File;
//   bio: string;
//   location?: string;
//   curriculumVitae?: File;
//   diploma?: File;

export async function updateUser(
  previousState: any,
  formData: FormData,
  userType: "student" | "teacher" | "moderator"
) {
  // protect the server action (authN, authZ, permissions)
  // validate/sanitize the inputs
  // call the DAL
  // while doing the above, handle the errors and send meaningfull messages to the user
  const profilePicture = formData.get("profilePicture");
  const cv = formData.get("curriculumVitae");
  const diploma = formData.get("diploma");

  // console.log(`FILE TYPE: ${typeof profilePicture}`);
  // console.log(`FILE INSTANCE OF FILE: ${profilePicture instanceof File}`);

  // if (!(profilePicture instanceof File) || profilePicture.size === 0) {
  //   console.error("Profile Picture is missing.");
  //   return "Profile Picture is missing.";
  // }
  // if (userType === "teacher") {
  //   if (!(cv instanceof File) || cv.size === 0) {
  //     console.error("CV is missing.");
  //     return "CV is missing.";
  //   }
  //   if (!(diploma instanceof File) || diploma.size === 0) {
  //     console.error("Diploma is missing.");
  //     return "Diploma is missing.";
  //   }
  // }

  const User = z.object({
    firstName: z.string().nonempty().trim(),
    lastName: z.string().nonempty().trim(),
    // password: z.string().nonempty().trim(),
    birthDate: z.coerce.date().max(new Date()),
    email: z.string().email().nonempty().trim(),
    realEmail: z.string().email().nonempty().trim(),
    phoneNumber: z.coerce.number(),
    bio: z.string().trim(),
    address: z.string().trim(),
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
    address: formData.get("location") || "",
    email: formData.get("email"),
    realEmail: formData.get("realEmail"),
    password: formData.get("password"),
    profilePicture: formData.get("profilePicture"),
    cv: formData.get("curriculumVitae"),
    diploma: formData.get("diploma"),
  });
  if (!result.success) {
    console.error(result.error.message);
    return "Entries not valid.";
  }
  console.log("No errors!");
  console.log(result.data);

  let profilePicId = null;

  if (profilePicture instanceof File && profilePicture.size > 0) {
    const profilePicArrayBuffer = await profilePicture.arrayBuffer();
    const profilePicBuffer = Buffer.from(profilePicArrayBuffer);
    try {
      profilePicId = await uploadFile(
        profilePicBuffer,
        profilePicture.name,
        String(profilePicture.size),
        profilePicture.type
      );
      console.log(`RESULT OF UPLOADING PROFILE PIC \n:`, profilePicId);
    } catch (err: any) {
      console.error(err);
      return "Could not update profile picture. Try again.";
    }
  }

  let cvId = null;
  let diplomaId = null;

  if (userType === "teacher") {
    if (cv instanceof File && cv.size > 0) {
      const cvArrayBuffer = await cv.arrayBuffer();
      const cvBuffer = Buffer.from(cvArrayBuffer);

      try {
        cvId = await uploadFile(cvBuffer, cv.name, String(cv.size), cv.type);
        console.log(`RESULT OF UPLOADING CV: \n`, cvId);
      } catch (err) {
        console.error(err);
        return "Could not update CV. Try again.";
      }
    }

    if (diploma instanceof File && diploma.size > 0) {
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
  }

  try {
    const res = await dbUpdateUser(result.data.realEmail, userType, {
      ...result.data,
      phoneNumber: String(result.data.phoneNumber),
      profilePicture: profilePicId,
      curriculumVitae: cvId,
      diploma: diplomaId,
    });
    console.log("User Updated Successfully!");
  } catch (err: any) {
    console.error(err.message);
    return "Could not update the user.";
  }

  revalidatePath(`/admin/${userType}s`);
}

export async function createUser(
  previousState: any,
  formData: FormData,
  argUserType: "student" | "teacher" | "moderator"
) {
  console.log(formData);
  //   const userType = formData.get("userType");
  const profilePicture = formData.get("profilePicture");
  const cv = formData.get("curriculumVitae");
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
    await dbCreateUser(argUserType, {
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

export async function deleteUser(userEmail: string, resourceName: string) {
  try {
    const result = await dbDeleteUser(userEmail);
    revalidatePath(`/admin/${resourceName}`);
    return `User with email ${userEmail} deleted successfully.`;
  } catch (err: any) {
    console.error(err.msg);
    return "We could not delete the user.";
  }
}
