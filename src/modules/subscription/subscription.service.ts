import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"


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














export const subscriptionService = {
    createCheckoutSession
}