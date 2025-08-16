import { omit } from "zod/v4-mini";

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

export interface Course {
  title: string;
  price: number;
  module: string;
  level: string;
  description: string;
}

export interface Session {
  startTime: string;
  endTime: string;
  day: string;
  module: string;
  level: string;
  price: number;
  type: "online" | "offline";
  addressLink: string;
  places: number;
}

export interface dbSession {
  seid: string;
  module: string;
  level: string;
  price: number;
  type: "offline" | "online";
  addressLink: string;
  day: Date;
  startTime: string;
  endTime: string;
  places: number;
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

export interface Checkout {
  id: string;
  entity: string;
  livemode: boolean;
  amount: number;
  currency: string;
  fees: number;
  fees_on_merchant: number;
  fees_on_customer: number;
  pass_fees_to_customer: number | null;
  chargily_pay_fees_allocation: "customer" | "merchant" | "split";
  status: "pending" | "processing" | "paid" | "failed" | "canceled";
  locale: "ar" | "en" | "fr";
  description: string | null;
  metadata: any; //A Set of key-value pairs that can be used to store additional information about the checkout.
  success_url: string;
  failure_url: string;
  webhook_endpoint: string | null;
  payment_method: string | null;
  invoice_id: string | null;
  customer_id: string | null;
  payment_link_id: string | null;
  created_at: number;
  updated_at: number;
  shipping_address: string | null;
  collect_shipping_address: boolean | any;
  discount: {
    type: "percentage" | "amount";
    value: number;
  } | null;
  amount_without_discount: number | null;
  checkout_url: string;
}

export type webhookCheckout = Omit<Checkout & { url: string }, "checkout_url">;
