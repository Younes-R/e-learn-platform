import crypto from "crypto";
import { updatePaymentRecord } from "@/database/dal/student";
import { webhookCheckout } from "@/database/definitions";

export async function POST(request: Request) {
  const signature = request.headers.get("signature");
  //   const body = await request.json();
  const rawBody = await request.text();
  //   const payload = JSON.stringify(body);

  if (!signature) return new Response(null, { status: 400 });

  const computedSignature = crypto
    .createHmac("sha256", process.env.CHARGILY_PAY_SECRET_KEY2!)
    .update(rawBody)
    .digest("hex");

  console.log(rawBody);
  console.log(computedSignature);
  console.log(signature);
  console.log(signature === computedSignature);

  if (computedSignature !== signature) return new Response(null, { status: 403 });

  const body = JSON.parse(rawBody);
  const event = body as unknown as {
    id: string;
    entity: string;
    livemode: string;
    type: string;
    data: webhookCheckout;
    created_at: number;
    updated_at: number;
  };

  console.log(event);

  try {
    switch (event.type) {
      case "checkout.paid":
        await updatePaymentRecord(event.data.id, "paid");
        break;

      case "checkout.failed":
        await updatePaymentRecord(event.data.id, "not paid");
        break;

      default:
        break;
    }
  } catch (err: any) {
    console.error(err.message);
    console.error("[API Route /payments/webhook]: Failed.");
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
