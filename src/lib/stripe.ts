
import Stripe from "stripe";
import config from "../config";

// call the class as like as prisma


export const stripe = new Stripe(config.stripe_secret_key)
