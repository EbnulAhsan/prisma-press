import { request } from "node:http"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import Stripe from "stripe";
import { log } from "node:console"
import { Session } from "node:inspector";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { handleChangeSubscription, handleCheckOutCompleted } from "./subscription.utils";
import status from "http-status";


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

            await handleChangeSubscription(event.data.object)



            break

        case 'customer.subscription.deleted':
            await handleChangeSubscription(event.data.object)

            break


        default:
            console.log('unhandled event type ${evet.type}')
            break


    }


}



const getSubscriptionStatus = async (userId: string) => {
    const isSubscriptionExist = await prisma.subscription.findFirstOrThrow({
        where: {
            userId
        }
    })

    const isActive = isSubscriptionExist.status === "ACTIVE" && isSubscriptionExist.currentPeriodEnd && new Date(isSubscriptionExist.currentPeriodEnd) > new Date


    return {
        status: isSubscriptionExist.status,
        isSubscribed: isActive,
        currentPeriodEnd: isSubscriptionExist.currentPeriodEnd
    }
}








export const subscriptionService = {
    createCheckoutSession, handleWebhook,
    getSubscriptionStatus
}