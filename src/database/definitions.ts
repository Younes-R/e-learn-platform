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
}

export interface SessionDataSegment {
  seid: string;
  module: string;
  day: Date;
  startTime: string;
  endTime: string;
}

export type DayData = Array<SessionDataSegment>;

export type CoursesDataSegments = Array<{
  cid: string;
  title: string;
  description: string;
  enrolledStudentsNumber: number;
}>;
