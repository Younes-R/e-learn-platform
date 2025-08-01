export interface Student {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phoneNumber: string;
  profilePic: string;
  pwd: string;
  refreshToken: string;
  bio: string;
}

export interface Teacher {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phoneNumber: string;
  profilePic: string;
  pwd: string;
  refreshToken: string;
  bio: string;
  address: string;
  cv: string;
  diploma: string;
}

export interface Moderator {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phoneNumber: string;
  profilePic: string;
  pwd: string;
  refreshToken: string;
  bio: string;
}

export interface Report {
  reporterId: string;
  reportedId: string;
  reporterName: string;
  reportedName: string;
  date: Date;
  reason: string;
}

export interface SessionData {
  seid: string;
  module: string;
  year: string;
  price: number;
  type: string;
  addressLink: string;
  day: Date;
  startTime: string;
  endTime: string;
  firstName: string;
  lastName: string;
}

export interface CoursePlus extends CourseDataSegment {
  price: number;
  module: string;
  level: string;
  documents: Array<string>;
}

export interface SessionDataSegment {
  seid: string;
  module: string;
  day: Date;
  startTime: string;
  endTime: string;
}
export interface CourseDataSegment {
  cid: string;
  title: string;
  description: string;
  enrolledStudentsNumber: number;
}

export type DayData = Array<SessionDataSegment>;

export type CoursesDataSegments = Array<CourseDataSegment>;

export type CoursesPlusData = Array<CoursePlus>;
