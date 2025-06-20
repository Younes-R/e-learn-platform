import { neon } from "@neondatabase/serverless";
import { Moderator, Student, Teacher } from "./definitions";

const sql = neon(process.env.DATABASE_URL!);

/**
 * Creates a new user in the database as a student, teacher, or moderator based on the specified type and user object.
 *
 * Delegates to the appropriate creation function depending on the user type and the presence of distinguishing properties in the user object.
 *
 * @param userType - The type of user to create: "student", "teacher", or "moderator"
 * @param user - The user data object, whose structure must match the specified user type
 * @returns The newly created user record
 * @throws If the user type or user object does not match the expected structure for any supported user type
 */
export async function createUser(userType: "student" | "teacher" | "moderator", user: Student | Teacher | Moderator) {
  if (userType == "student" && "bio" in user && !("cv" in user)) {
    return await createStudent(user);
  }

  if (userType == "teacher" && "cv" in user) {
    return await createTeacher(user);
  }

  if (userType == "moderator" && !("address" in user) && !("bio" in user)) {
    return await createModerator(user);
  }

  throw new Error("Invalid user type or user object!");
}

/**
 * Inserts a new student record into the users table.
 *
 * @param user - The student data to be inserted
 * @returns The result of the insert operation containing the created user record
 * @throws If the database operation fails, throws a generic database error
 */
async function createStudent(user: Student) {
  try {
    const result =
      await sql`INSERT INTO users (first_name, last_name, email, type, birth_date, phone_number, profile_pic, pwd, refresh_token, bio, address, cv, diploma) VALUES (
      ${user.firstName}, ${user.lastName}, ${user.email}, 'student', ${user.birthDate}, ${user.phoneNumber}, ${user.profilePic}, ${user.pwd}, ${user.refreshToken}, ${user.bio}, NULL, NULL, NULL 
      ) returning *`;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: could not create user!");
  }
}

/**
 * Inserts a new teacher record into the users table.
 *
 * @param user - The teacher object containing personal and credential information to be stored.
 * @returns The result of the insert operation, including the newly created teacher record.
 * @throws If the database operation fails, throws a generic database error.
 */
async function createTeacher(user: Teacher) {
  try {
    const result =
      await sql`INSERT INTO users (first_name, last_name, email, type, birth_date, phone_number, profile_pic, pwd, refresh_token, bio, address, cv, diploma) VALUES (
        ${user.firstName}, ${user.lastName}, ${user.email}, 'teacher', ${user.birthDate}, ${user.phoneNumber}, ${user.profilePic}, ${user.pwd}, ${user.refreshToken}, ${user.bio}, ${user.address}, ${user.cv}, ${user.diploma}
        ) returning *`;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: could not create user!");
  }
}

/**
 * Creates a new moderator user record in the database.
 *
 * Inserts a moderator into the `users` table with required fields, setting optional profile fields to null.
 * @returns The result of the database insertion containing the created user record.
 */
async function createModerator(user: Moderator) {
  try {
    const result =
      await sql`INSERT INTO users (
        first_name,
        last_name,
        email,
        type,
        birth_date,
        phone_number,
        profile_pic,
        pwd,
        refresh_token,
        bio,
        address,
        cv,
        diploma
      ) VALUES (
        ${user.firstName},
        ${user.lastName},
        ${user.email},
        'moderator',
        ${user.birthDate},
        ${user.phoneNumber},
        ${user.profilePic},
        ${user.pwd},
        ${user.refreshToken},
        NULL,
        NULL,
        NULL,
        NULL
      ) returning *`;
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Database Error: could not create user!");
  }
}

/**
 * Retrieves and logs the current PostgreSQL server version.
 */
export async function getPostgresVersion() {
  const res = await sql`SELECT version();`;
  console.log(res);
}

/**
 * Initializes the database schema by creating required types and tables if they do not exist.
 *
 * This includes user roles, users, courses, chapters, documents, sessions, payments, attendance, and reports, along with their associated enum types and constraints.
 */
export async function initializeDatabase() {
  const [res1, res2] = await sql.transaction([
    sql`CREATE TYPE IF NOT EXISTS user_type AS ENUM ('student', 'teacher', 'moderator', 'admin')`,
    sql`CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(100) UNIQUE NOT NULL,
    type user_type,
    birth_date DATE,
    phone_number VARCHAR(20),
    profile_pic VARCHAR,
    pwd VARCHAR,
    refresh_token VARCHAR,
    bio VARCHAR(500),
    address VARCHAR(80),
    cv VARCHAR,
    diploma VARCHAR
    )`,
    // ...other statements
  ]);

  // ...rest of initialization
}
    sql`CREATE TABLE IF NOT EXISTS courses(
    cid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(30),
    description VARCHAR(500),
    price INT,
    module VARCHAR(80),
    c_year VARCHAR(30),
    id UUID,
    FOREIGN KEY (id) REFERENCES users(id)
    )`,
    sql`CREATE TABLE IF NOT EXISTS chapters(
    title VARCHAR(30),
    cid UUID,
    PRIMARY KEY(title, cid),
    FOREIGN KEY (cid) REFERENCES courses(cid)
    )`,
    sql`CREATE TABLE IF NOT EXISTS documents(
    file_id VARCHAR,
    doc_title VARCHAR(30),
    title VARCHAR(30),
    cid UUID,
    PRIMARY KEY(doc_title, title, cid),
    FOREIGN KEY (title, cid) REFERENCES chapters(title, cid)
    )`,
    sql`CREATE TYPE IF NOT EXISTS session_type AS ENUM ('online', 'offline')`,
    sql`CREATE TABLE IF NOT EXISTS sessions(
    seid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(80),
    year VARCHAR(30),
    price INT,
    type session_type,
    address_link VARCHAR,
    day DATE,
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    id UUID,
    FOREIGN KEY (id) REFERENCES users(id)
    )`,
    sql`CREATE TYPE IF NOT EXISTS payment_type AS ENUM ('paid', 'not paid')`,
    sql`CREATE TABLE IF NOT EXISTS payments(
    pid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE,
    status payment_type,
    checkout_id VARCHAR,
    id UUID,
    cid UUID,
    seid UUID,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (cid) REFERENCES courses(cid),
    FOREIGN KEY (seid) REFERENCES sessions(seid)
    )`,
    sql`CREATE TABLE IF NOT EXISTS attendance(
    id UUID,
    seid UUID,
    PRIMARY KEY(id, seid),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (seid) REFERENCES sessions(seid)
    )`,
    sql`CREATE TYPE IF NOT EXISTS action_type AS ENUM ('alert', 'ban', 'delete')`,
    sql`CREATE TABLE IF NOT EXISTS reports(
    reporter_id UUID,
    reported_id UUID,
    date DATE,
    PRIMARY KEY (reporter_id, reported_id, date),
    reason INT,
    action action_type,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_id) REFERENCES users(id)
    )`,
  ]);

  console.log(res1, res2);
}
