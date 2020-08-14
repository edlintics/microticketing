import Stripe from "stripe";

// create a stripe instance so it will be abl eto use in the rest of the project
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2020-03-02",
});
