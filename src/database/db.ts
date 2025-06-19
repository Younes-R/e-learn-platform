import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getPostgresVersion() {
  const res = await sql`SELECT version();`;
  console.log(res);
}

export async function initializeDatabase() {
  const [res1, res2] = await sql.transaction([
    sql`CREATE TYPE user_type AS ENUM ('student', 'teacher', 'moderator', 'admin')`,
    sql`CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
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
    sql`CREATE TABLE courses(
    cid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(30),
    description VARCHAR(500),
    price INT,
    module VARCHAR(80),
    c_year VARCHAR(30),
    id UUID,
    FOREIGN KEY (id) REFERENCES users(id)
    )`,
    sql`CREATE TABLE chapters(
    title VARCHAR(30),
    cid UUID,
    PRIMARY KEY(title, cid),
    FOREIGN KEY (cid) REFERENCES courses(cid)
    )`,
    sql`CREATE TABLE documents(
    file_id VARCHAR,
    doc_title VARCHAR(30),
    title VARCHAR(30),
    cid UUID,
    PRIMARY KEY(doc_title, title, cid),
    FOREIGN KEY (title, cid) REFERENCES chapters(title, cid)
    )`,
    sql`CREATE TYPE session_type AS ENUM ('online', 'offline')`,
    sql`CREATE TABLE sessions(
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
    sql`CREATE TYPE payment_type AS ENUM ('paid', 'not paid')`,
    sql`CREATE TABLE payments(
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
    sql`CREATE TABLE attendance(
    id UUID,
    seid UUID,
    PRIMARY KEY(id, seid),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (seid) REFERENCES sessions(seid)
    )`,
    sql`CREATE TYPE action_type AS ENUM ('alert', 'ban', 'delete')`,
    sql`CREATE TABLE reports(
    reporter_id UUID,
    reported_id UUID,
    date DATE,
    PRIMARY KEY (reporter_id, reported_id, date),
    reason INT,
    action action_type
    )`,
  ]);
}
