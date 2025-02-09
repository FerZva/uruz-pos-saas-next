import prisma from "../../../lib/prisma";
import { stripe } from "../../../lib/stripe";
import { Plan } from "@prisma/client";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );

        const customerId = session.customer as string;
        const customerEmail = session.customer_details?.email;

        if (!customerEmail) {
          throw new Error("Customer email not found in session");
        }

        let user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        if (!user) {
          // Crear el usuario si no existe
          user = await prisma.user.create({
            data: {
              email: customerEmail,
              name: session.customer_details?.name || "No name provided",
              customerId,
              plan: "free", // Por defecto, "free" hasta que se cree la suscripción
            },
          });
        }

        // Actualizar el customerId de Stripe si falta
        if (!user.customerId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { customerId: customerId || `temp_${user.id}` },
          });
        }

        const lineItems = session.line_items?.data || [];
        for (const item of lineItems) {
          const priceId = item.price?.id;
          const plan = mapPriceIdToPlan(priceId); // Mapear price ID al enum Plan
          const isSubscription = item.price?.type === "recurring";

          if (isSubscription && plan) {
            const endDate = calculateSubscriptionEndDate(priceId);

            // Crear o actualizar la suscripción
            await prisma.subscription.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                plan,
                startDate: new Date(),
                endDate,
                period: plan.includes("Yearly") ? "yearly" : "monthly",
              },
              update: {
                plan,
                startDate: new Date(),
                endDate,
                period: plan.includes("Yearly") ? "yearly" : "monthly",
              },
            });

            // Actualizar el campo plan del usuario
            await prisma.user.update({
              where: { id: user.id },
              data: { plan, customerId },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { customerId },
        });

        if (user) {
          // Revertir al plan "free" cuando la suscripción sea eliminada
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "free" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling Stripe webhook event", error);
    return new Response("Webhook Error", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}

function mapPriceIdToPlan(priceId: string | undefined): Plan | null {
  if (!priceId) return null;

  const priceMap: Record<string, Plan> = {
    [process.env.STRIPE_ENTERPRISE_BASIC_MONTHLY_PRICE_ID!]:
      "enterpriseBasicMonthly",
    [process.env.STRIPE_ENTERPRISE_BASIC_YEARLY_PRICE_ID!]:
      "enterpriseBasicYearly",
    [process.env.STRIPE_ENTERPRISE_PLUS_MONTHLY_PRICE_ID!]:
      "enterprisePlusMonthly",
    [process.env.STRIPE_ENTERPRISE_PLUS_YEARLY_PRICE_ID!]:
      "enterprisePlusYearly",
    [process.env.STRIPE_ENTERPRISE_PREMIMUM_MONTHLY_PRICE_ID!]:
      "enterprisePremiumMonthly",
    [process.env.STRIPE_ENTERPRISE_PREMIMUM_YEARLY_PRICE_ID!]:
      "enterprisePremiumYearly",
  };

  return priceMap[priceId] || null;
}

function calculateSubscriptionEndDate(priceId: string | undefined): Date {
  const endDate = new Date();
  if (priceId?.includes("Yearly")) {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else if (priceId?.includes("Monthly")) {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  return endDate;
}
