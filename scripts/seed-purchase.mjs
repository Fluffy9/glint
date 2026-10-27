import Stripe from "stripe";

const projectId = "glint-local";
const region = "us-central1";
const stripeKey = "sk_test_local";
const webhookSecret = "whsec_local_emulator";
const email = process.argv[2] ?? "buyer@example.com";
const stripe = new Stripe(stripeKey);
const event = {
  id: `evt_local_${Date.now()}`,
  object: "event",
  type: "checkout.session.completed",
  data: {
    object: {
      id: `cs_local_${Date.now()}`,
      object: "checkout.session",
      customer: "cus_local",
      customer_details: { email },
      customer_email: email,
      amount_total: 7999,
      payment_status: "paid",
      metadata: { band: "true", backup: "true" },
      subscription: null,
    },
  },
};
const payload = JSON.stringify(event);
const signature = stripe.webhooks.generateTestHeaderString({
  payload,
  secret: webhookSecret,
});
const url = `http://127.0.0.1:5001/${projectId}/${region}/stripeWebhook`;
const response = await fetch(url, {
  method: "POST",
  headers: { "stripe-signature": signature, "content-type": "application/json" },
  body: payload,
});
const text = await response.text();
if (!response.ok) {
  console.error(text);
  process.exit(1);
}
console.log(`Recorded a year of backup for ${email}`);
