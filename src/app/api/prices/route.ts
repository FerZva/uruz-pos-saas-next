import { NextResponse } from "next/server";
import { Stripe } from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const prices = await stripe.prices.list({
      expand: ["data.product"],
    });

    const filteredPrices = prices.data.filter(
      (price) =>
        price.nickname === "Enterprise" ||
        price.nickname === "Enterprise Lifetime" ||
        price.nickname === "Enterprise Premium"
    );

    const enrichedPrices = filteredPrices.map((price) => {
      const product = price.product as Stripe.Product;
      const marketingFeatures = product.metadata.marketing_features
        ? product.metadata.marketing_features.split(",")
        : [];
      return {
        ...price,
        marketingFeatures,
      };
    });

    return NextResponse.json(enrichedPrices);
  } catch (error) {
    console.log("[STRIPE_PRICING_ERROR]: ", error);
  }
}
