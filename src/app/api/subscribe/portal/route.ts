import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { setupLemonSqueezy } from "@/lib/lemon-squeezy";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await db.lemonSqueezySubscription.findUnique({
      where: {
        userId: userId,
      }
    });

    if (!subscription || !subscription.lemonSqueezySubscriptionId) {
      return new NextResponse("Not Subscribed", { status: 400 });
    }

    setupLemonSqueezy();

    const { data: lsSubscription, error } = await getSubscription(subscription.lemonSqueezySubscriptionId);

    if (error || !lsSubscription) {
      return new NextResponse("Failed to fetch portal URL", { status: 500 });
    }

    return NextResponse.json({ url: lsSubscription.data.attributes.urls.customer_portal });
  } catch (error) {
    console.log("[SUBSCRIBE_PORTAL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
