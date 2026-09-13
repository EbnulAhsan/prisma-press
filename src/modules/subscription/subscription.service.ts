import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { handleChangeSubscription, handleCheckOutCompleted } from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        });

        let stripeCustomerId = user.subscription?.stripeCustomerId;

        // Jodi customer ID thake, check korbo Stripe-e eita valid kina
        if (stripeCustomerId) {
            try {
                const existingCustomer = await stripe.customers.retrieve(stripeCustomerId);
                if ((existingCustomer as Stripe.DeletedCustomer).deleted) {
                    stripeCustomerId = undefined;
                }
            } catch (err) {
                // Stripe-e customer na thakle reset korbo
                stripeCustomerId = undefined;
            }
        }

        // Customer na thakle ba invalid hole notun customer banabo
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            });

            stripeCustomerId = customer.id;

            // Existing subscription record thakle customer ID update korbo
            if (user.subscription) {
                await tx.subscription.update({
                    where: { userId: user.id },
                    data: { stripeCustomerId: customer.id }
                });
            }
        }

        // Checkout session create
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: config.stripe_price_id || "price_1TxNPfFhadYR9ZUf6vUG4K7Y",
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: { userId: user.id }
        });

        return session.url;
    });

    return {
        paymentUrl: transactionResult
    };
};

// Payment shesh hole frontend theke session_id verify kore user-ke ACTIVE korar function
const verifyPaymentSession = async (sessionId: string, userId: string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
        const subscriptionId = session.subscription as string;
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

        const currentPeriodEnd = new Date((stripeSub as any).current_period_end * 1000);

        await prisma.subscription.upsert({
            where: { userId },
            update: {
                status: SubscriptionStatus.ACTIVE,
                stripeSubscriptionId: subscriptionId,
                currentPeriodEnd
            },
            create: {
                userId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscriptionId,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodEnd
            }
        });

        return {
            success: true,
            message: "Subscription successfully activated!"
        };
    }

    throw new Error("Payment was not completed");
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckOutCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        case "customer.subscription.updated":
            await handleChangeSubscription(event.data.object as Stripe.Subscription);
            break;

        case "customer.subscription.deleted":
            await handleChangeSubscription(event.data.object as Stripe.Subscription);
            break;

        default:
            console.log(`unhandled event type ${event.type}`);
            break;
    }
};

const getSubscriptionStatus = async (userId: string) => {
    const isSubscriptionExist = await prisma.subscription.findFirst({
        where: {
            userId
        }
    });

    if (!isSubscriptionExist) {
        return {
            status: SubscriptionStatus.INACTIVE,
            isSubscribed: false,
            currentPeriodEnd: null
        };
    }

    const isActive =
        isSubscriptionExist.status === SubscriptionStatus.ACTIVE &&
        Boolean(isSubscriptionExist.currentPeriodEnd) &&
        new Date(isSubscriptionExist.currentPeriodEnd!) > new Date();

    return {
        status: isSubscriptionExist.status,
        isSubscribed: isActive,
        currentPeriodEnd: isSubscriptionExist.currentPeriodEnd
    };
};

export const subscriptionService = {
    createCheckoutSession,
    verifyPaymentSession,
    handleWebhook,
    getSubscriptionStatus
};