import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

export const getPeriodEnd = (subscription: Stripe.Subscription) => {
    const currentPeriodEndInSeconds =
        subscription.items.data[0]?.current_period_end;

    if (!currentPeriodEndInSeconds) {
        throw new Error("Current period end not found");
    }

    return new Date(currentPeriodEndInSeconds * 1000);
};

export const handleCheckOutCompleted = async (
    session: Stripe.Checkout.Session
) => {
    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
        // throw new Error("Webhook validation failed");

        console.log("webhook : missing values for creating checkout ")
        return


    }

    // Retrieve the subscription after getting its ID
    const stripeSubscription = await stripe.subscriptions.retrieve(
        stripeSubscriptionId
    );

    const currentPeriodEnd = getPeriodEnd(stripeSubscription);

    await prisma.subscription.upsert({
        where: {
            userId,
        },
        create: {
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            status: "ACTIVE",
            currentPeriodEnd,
        },
        update: {
            stripeCustomerId,
            stripeSubscriptionId,
            status: "ACTIVE",
            currentPeriodEnd,
        },
    });
};

// handler function for subscription deleted and updated


export const handleChangeSubscription = async (payload: Stripe.Subscription) => {

    const stripeSubscriptionId = payload.id
    const status = payload.status === "active" ? SubscriptionStatus.ACTIVE :
        payload.status === "trialing" ? SubscriptionStatus.ACTIVE :
            payload.status === "canceled" ? SubscriptionStatus.CANCELED : SubscriptionStatus.EXPIRED


    const currentPeriodEnd = getPeriodEnd(payload)


    const isSubscriptionExist = await prisma.subscription.findUnique({
        where: {
            stripeSubscriptionId
        }
    })

    if (!isSubscriptionExist) {
        console.log(`webhook: No subscription found for subscription id : ${stripeSubscriptionId}`)

        return
    }

    await prisma.subscription.update({
        where: {
            stripeSubscriptionId

        },
        data: {
            status,
            currentPeriodEnd
        }
    })




}