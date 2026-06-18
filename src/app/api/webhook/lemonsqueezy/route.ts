import crypto from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    
    const headerSignature = (await headers()).get("X-Signature") || "";
    const signature = Buffer.from(headerSignature, "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const obj = payload.data.attributes;

    const customData = payload.meta.custom_data || {};
    const userId = customData.user_id;

    if (eventName === "order_created") {
      const courseId = customData.course_id;

      if (!userId || !courseId) {
        // Podría ser una compra de suscripción que no lleva course_id
      } else {
        await db.purchase.create({
          data: {
            courseId: courseId,
            userId: userId,
          }
        });
      }
    }

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const lemonCustomerId = String(obj.customer_id);
      const subscriptionId = String(payload.data.id);
      const variantId = String(obj.variant_id);
      const endsAt = new Date(obj.renews_at); // or ends_at if cancelled

      const actualUserId = userId || await findUserByLemonCustomerId(lemonCustomerId);

      if (actualUserId) {
        await db.lemonSqueezySubscription.upsert({
          where: {
            userId: actualUserId,
          },
          create: {
            userId: actualUserId,
            lemonSqueezyCustomerId: lemonCustomerId,
            lemonSqueezySubscriptionId: subscriptionId,
            lemonSqueezyVariantId: variantId,
            lemonSqueezyCurrentPeriodEnd: endsAt,
          },
          update: {
            lemonSqueezySubscriptionId: subscriptionId,
            lemonSqueezyVariantId: variantId,
            lemonSqueezyCurrentPeriodEnd: endsAt,
          }
        });

        // Asegurar que el customer exista
        await db.lemonSqueezyCustomer.upsert({
          where: { userId: actualUserId },
          create: { userId: actualUserId, lemonSqueezyCustomerId: lemonCustomerId },
          update: { lemonSqueezyCustomerId: lemonCustomerId }
        });
      }
    }

    if (eventName === "subscription_expired" || eventName === "subscription_cancelled") {
      const subscriptionId = String(payload.data.id);
      
      const sub = await db.lemonSqueezySubscription.findUnique({
        where: { lemonSqueezySubscriptionId: subscriptionId }
      });

      if (sub) {
        await db.lemonSqueezySubscription.update({
          where: { id: sub.id },
          data: {
            lemonSqueezyCurrentPeriodEnd: eventName === "subscription_expired" ? new Date(0) : sub.lemonSqueezyCurrentPeriodEnd,
            // Si está cancelada pero aún no expira, mantenemos ends_at, LemonSqueezy envía subscription_updated con ends_at
          }
        });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("[LEMON_SQUEEZY_WEBHOOK]", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
}

async function findUserByLemonCustomerId(customerId: string) {
  const customer = await db.lemonSqueezyCustomer.findUnique({
    where: { lemonSqueezyCustomerId: customerId }
  });
  return customer?.userId;
}
