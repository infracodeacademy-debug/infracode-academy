import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { setupLemonSqueezy } from "@/lib/lemon-squeezy";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await db.lemonSqueezySubscription.findUnique({
      where: {
        userId: userId,
      }
    });

    if (subscription && subscription.lemonSqueezyCurrentPeriodEnd && subscription.lemonSqueezyCurrentPeriodEnd.getTime() > Date.now()) {
      return new NextResponse("Already Subscribed", { status: 400 });
    }

    setupLemonSqueezy();

    const storeId = process.env.LEMON_SQUEEZY_STORE_ID!;
    const variantId = process.env.LEMON_SQUEEZY_SAAS_VARIANT_ID!;

    if (!storeId || !variantId) {
      return new NextResponse("Lemon Squeezy not configured", { status: 500 });
    }

    const { data: checkout, error: checkoutError } = await createCheckout(
      storeId,
      variantId,
      {
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        checkoutData: {
          email: user.emailAddresses[0].emailAddress,
          custom: {
            user_id: userId,
            is_subscription: "true",
          },
        },
        productOptions: {
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=1`,
          receiptButtonText: "Ir al Dashboard",
          receiptLinkUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=1`,
        }
      }
    );

    if (checkoutError || !checkout) {
      console.error("[LEMON_SQUEEZY_CHECKOUT_ERROR]", checkoutError);
      return new NextResponse("Error creating checkout", { status: 500 });
    }

    return NextResponse.json({ url: checkout.data.attributes.url });
  } catch (error) {
    console.log("[SUBSCRIBE_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}
