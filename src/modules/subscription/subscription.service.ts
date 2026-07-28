import { request } from "node:http"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import Stripe from "stripe";
import { log } from "node:console"
import { Session } from "node:inspector";


const createCheckoutSession = async (userId: string) => {

    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })


        // for old subscriber

        let stripeCustomerId = user.subscription?.stripeCustomerId

        // //  create a stripe customer id------



        if (!stripeCustomerId) {

            // for new subscriber 
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })


            stripeCustomerId = customer.id
        }

        // check out session create------

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: "price_1TxNPfFhadYR9ZUf6vUG4K7Y",
                    quantity: 1
                }
            ],
            mode: "subscription",
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success= true`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: { userId: user.id }
        })

        return session.url



    })


    return {
        paymentUrl: transactionResult
    }



}


// new function

const handleWebhook = async (payload: Buffer, signature: string) => {

    const endpointSecret = config.stripe_webhook_secret

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret

    )


    switch (event.type) {
        case 'checkout.session.completed':
            // console.log(event.data.object);


            await handleCheckOutCompleted(event.data.object)







            break;

        case 'customer.subscription.updated':

            break

        case 'customer.subscription.deleted':
            break


        default:
            console.log('unhandled event type ${evet.type}')
            break


    }


}


const getPeriodEnd = (subscription: Stripe.Subscription) => {
    const currentPeriodEndInSeconds =
        subscription.items.data[0]?.current_period_end;

    if (!currentPeriodEndInSeconds) {
        throw new Error("Current period end not found");
    }

    return new Date(currentPeriodEndInSeconds * 1000);
};

const handleCheckOutCompleted = async (
    session: Stripe.Checkout.Session
) => {
    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
        throw new Error("Webhook validation failed");
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


const handleChangeSubscription = () => {
    
}






export const subscriptionService = {
    createCheckoutSession, handleWebhook
}