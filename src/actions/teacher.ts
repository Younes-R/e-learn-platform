"use server";
import * as z from "zod/v4";
import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { uploadFile } from "@/database/b2";
import {
  createCourse as dbCreateCourse,
  deleteCourse as dbDeleteCourse,
  createSession as dbCreateSession,
  deleteSession as dbDeleteSession,
} from "@/database/dal/teacher";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteSession(sessionId: string) {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);

  try {
    const res = await dbDeleteSession(email, sessionId);
  } catch (err: any) {
    console.error(err.message);
    console.error("[SA deleteSession]: Failed to delete session.");
    return "Failed to delete session. Try again!";
  }
}

export async function createSession(previousState: any, formData: FormData) {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  console.log(formData);
  const Session = z.object({
    startTime: z.iso.time(),
    endTime: z.iso.time(),
    day: z.iso.date(),
    module: z.string().nonempty(),
    level: z.string().nonempty(),
    price: z.coerce.number().nonnegative(),
    type: z.enum(["offline", "online"]),
    addressLink: z.string().nonempty(),
    places: z.coerce.number().positive(),
  });

  const result = Session.safeParse({
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    day: formData.get("day"),
    module: formData.get("module"),
    level: formData.get("level"),
    price: formData.get("price") !== "" ? formData.get("price") : "NaN",
    type: formData.get("type"),
    addressLink: formData.get("addressLink"),
    places: formData.get("places"),
  });

  if (!result.success) {
    console.error("[SA createSession]:");
    result.error.issues.map((issue, idx) => {
      console.error(`   Issue ${idx} (${issue.path}): ${issue.message}.`);
    });
    return `Error`;
  }
  console.log("No errors.");
  const session = result.data;

  try {
    const res = await dbCreateSession(email, session);
    revalidatePath("/teacher/schedule");
  } catch (err: any) {
    console.error(err.message);
    console.error("[SA createSession]: Failed to create a session.");
    return "Failed to create a session. Try again!";
  }
}

export async function deleteCourse(courseId: string) {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);
  try {
    const result = await dbDeleteCourse(email, courseId);
    revalidatePath("/teacher/courses");
  } catch (err: any) {
    console.error(err.message);
    console.error("[SA deleteCourse]: Failed to delete course.");
    return "Failed to delete course. Try again!";
  }
}

export async function createCourse(previousState: any, formData: FormData) {
  const { email } = await verifyRefreshToken();
  await verifyRoles(["teacher"]);

  const Course = z.object({
    title: z.string().nonempty("You must provide a title.").trim(),
    price: z.coerce.number("You must provide a price >= to 0.").nonnegative("You must provide a price >= to 0."),
    module: z.string().nonempty("You must provide a module.").trim(),
    level: z.string().nonempty("You must provide a level.").trim(),
    description: z.string().nonempty("You must provide a description.").trim(),
    files: z
      .array(
        z.file().refine((file) => file.size > 0 && !file.name.includes(" "), "You must include at least one document.")
      )
      .nonempty(),
  });

  const result = Course.safeParse({
    title: formData.get("title"),
    price: formData.get("price") !== "" ? formData.get("price") : "NaN",
    module: formData.get("module"),
    level: formData.get("level"),
    description: formData.get("description"),
    files: formData.getAll("files"),
  });

  if (!result.success) {
    console.error(result.error.issues);
    result.error.issues.map((issue, idx) => {
      console.error(`[${idx}]: ${String(issue.path[0])}
        Code: ${issue.code}
        Input: ${issue.input}
        Message: ${issue.message}
        `);
    });
    return result.error.issues;
  }

  const course = result.data;

  const documents = await Promise.all(
    course.files.map(async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileId = await uploadFile(fileBuffer, file.name, String(file.size), file.type);
      return { fileId: fileId, title: file.name };
    })
  );

  try {
    const result = await dbCreateCourse(email, course, documents);
    revalidatePath("/teacher/courses");
  } catch (err: any) {
    console.error(err.message);
    console.error("[SA createCourse]: Failed to create course.");
    return "Failed to create a course. Try again.";
  }

  console.log("No errors!");
  // console.log(`[SA createCourse]: FORM DATA: \n`, formData);
  // const filesArr = formData.getAll("files") as Array<File>;
  // console.log(`Files Type:`, typeof filesArr);
  // console.log(`Files instance of File?:`, filesArr instanceof File);
  //   console.log(`Files instance of FileList?: `, filesArr instanceof FileList);
  // console.log(`Files[0] instance of File:`, filesArr[0] instanceof File);
  //   console.log(`Files[0] Type: `, typeof filesArr[0]);
  //   console.log(`Files Content: `, filesArr);
}
