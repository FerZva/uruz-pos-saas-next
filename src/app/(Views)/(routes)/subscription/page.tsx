import { currentUser } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

const handleSubscription = async (planId: string) => {
  const res = await fetch("/api/checkout/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, userId: currentUser }),
  });

  const { url } = await res.json();
  window.location.href = url;
};

const SubscriptionPage = () => {
  return <div>Subscription page (protected)</div>;
};

export default SubscriptionPage;
