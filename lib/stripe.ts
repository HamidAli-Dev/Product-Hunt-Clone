"use server";

import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});
const priceId = process.env.STRIPE_PRICE_ID;

// Create a function to generate checkout link
export const createCheckoutSession = async ({ email }: { email: string }) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/new-product`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  });

  return { url: session.url };
};

// Create a function to get customer portal link
export const createCustomerLink = async () => {
  try {
    const authUser = await auth();
    if (!authUser || !authUser.user || !authUser.user.id) {
      throw new Error("Unauthorized");
    }

    const email = authUser.user.email;

    // Get customer ID
    const customer = await stripe.customers.list({
      email: email as string,
      limit: 1,
    });


    if (!customer || customer.data.length === 0) {
      // Create a new customer if not found
      const newCustomer = await stripe.customers.create({
        email: email as string,
      });
      
      const portal = await stripe.billingPortal.sessions.create({
        customer: newCustomer.id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/my-products`,
      });

      return portal.url;
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/my-products`,
    });

    return portal.url;
  } catch (error) {
    console.error("Stripe error details:", error);
    throw new Error("Failed to create customer portal session");
  }
};

export const getNextPaymentDetails = async () => {
  try {
    const authUser = await auth();

    if (!authUser || !authUser.user || !authUser.user.email) {
      console.log("No authenticated user found");
      throw new Error("User not authenticated");
    }

    const email = authUser.user.email;
    console.log("Fetching details for email:", email);

    const customers = await stripe.customers.list({
      email: email,
    });

    console.log("Found customers:", customers.data.length);

    if (!customers || customers.data.length === 0) {
      console.log("No customer found for email:", email);
      throw new Error("Customer not found");
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      expand: ['data.items.data.price']
    });


    if (!subscriptions || subscriptions.data.length === 0) {
      console.log("No active subscriptions found for customer:");
    }

    const subscription = subscriptions.data[0] as Stripe.Subscription & {
      items: {
        data: Array<{
          price: Stripe.Price;
          current_period_end: number;
        }>;
      };
    };

    // Get the first subscription item
    const subscriptionItem = subscription.items.data[0];
    if (!subscriptionItem || !subscriptionItem.current_period_end) {
      console.log("No current_period_end found in subscription item");
      return null;
    }

    const nextPaymentDate = new Date(subscriptionItem.current_period_end * 1000);

    // Check if date is valid before formatting
    if (isNaN(nextPaymentDate.getTime())) {
      console.log("Invalid date generated from current_period_end");
      return null;
    }

    // Format date to Month DD, YYYY
    const formattedNextPaymentDate = nextPaymentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    const price = subscriptionItem.price;

    if (!price || !price.unit_amount || !price.currency) {
      console.log("Invalid price details found");
      throw new Error("Price not found");
    }

    return {
      nextPaymentDate: formattedNextPaymentDate,
      amount: price.unit_amount / 100,
      currency: price.currency,
    };
  } catch (error) {
    console.error("Error in getNextPaymentDetails:", error);
    return null;
  }
};
