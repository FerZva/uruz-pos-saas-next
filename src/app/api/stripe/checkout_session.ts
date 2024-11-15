const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY!);
const priceID = "prod_R0xmS6xjJVxd4E";

export default async function handler(req: any, res: any) {
  switch (req.method) {
    case "POST":
      try {
        const session = await stripe.checkout.session.create({
          ui_mode: "embedded",
          line_items: [
            {
              price: "{{price_1Q8w1wID4FUmyo21aBOMaAPm}}",
              quantity: 1,
            },
          ],
          mode: "payment",
          return_url: `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
          automatic_text: { enabled: true },
        });

        res.send({ clientSecret: session.client_secret });
      } catch (error: any) {
        res.status(error.statusCode || 500).json(error.message);
      }
      break;
    default:
      res.setHeader("Allow", req.method);
      res.status(405).end("Method Not Allowed");
  }
}
