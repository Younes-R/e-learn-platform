"use server";

import { verifyRefreshToken, verifyRoles } from "@/lib/utils";
import { isSessionBoughtByStudent, isCourseBoughtByStudent, createPaymentRecord } from "@/database/dal/student";
import { Checkout } from "@/database/definitions";
import { redirect } from "next/navigation";

export async function buyProduct(productType: "course" | "session", productId: string) {
  const { email, role } = await verifyRefreshToken();
  await verifyRoles(["student"]);

  let result: boolean;
  let productPrice: number;
  let res;

  try {
    switch (productType) {
      case "session":
        res = await isSessionBoughtByStudent(email, productId);
        break;
      case "course":
        res = await isCourseBoughtByStudent(email, productId);
        break;
      default:
        throw new Error("[SA buyProduct]: Function was passed a bad productType arg value.", {
          cause: {
            type: "badArgumentType",
            description: 'productType argument can only take "course" or "session" as values.',
          },
        });
        break;
    }
  } catch (err: any) {
    if (err?.cause?.type === "badArgumentType") {
      console.error(err.message);
    }
    console.error(err.messsage);
    console.error("[SA buyProduct]: Failed to buy the product.");
    return "Cannot buy product."; // we need to be precise here: we need to distinguish between cases, is it because of a db connection problem, because of the product being already bought before by the student or some other causes we did not think of too
  }

  if (res.result) {
    console.error(`[SA buyProduct]: ${productType} is bought already by user!`);
    return `You have already bought this ${productType}!`;
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CHARGILY_PAY_SECRET_KEY2}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: res.price,
      currency: "dzd",
      success_url: `${process.env.APP_URL}/payments/success`,
      failure_url: `${process.env.APP_URL}/payments/failure`,
      webhook_endpoint: `${process.env.APP_URL}/api/payments/webhook`,
    }),
  };

  let checkout: Checkout;

  // console.log(res);

  try {
    const res = await fetch("https://pay.chargily.net/test/api/v2/checkouts", options);

    if (!res.ok) throw new Error("[fetch Chargily Pay]: Failed.", { cause: await res.json() });

    checkout = await res.json();
    // console.log(checkout);
  } catch (err: any) {
    console.error(err.message);
    console.error("[fetch Chargily Pay]: Cause:", err.cause.message);
    if (err.cause.errors) console.error(err.cause.errors);
    console.error("[SA buyProduct]: Failed to buy product.");
    return "Connection Problem. Try again!";
  }

  try {
    await createPaymentRecord(email, productType, productId, checkout.id, new Date());
  } catch (err: any) {
    console.error(err.message);
    console.error("[SA buyProduct]: Failed to buy product.");
    return "A problem occured. Try again!";
  }

  redirect(checkout.checkout_url);
}
