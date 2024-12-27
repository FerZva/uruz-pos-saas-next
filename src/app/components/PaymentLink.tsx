"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type PaymentLinkProps = {
  href: string;
  paymentLink?: string;
  text: string;
};

const PaymentLink = ({ href, paymentLink, text }: PaymentLinkProps) => {
  return (
    <Link
      href={href}
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem("stripePaymentLink", paymentLink);
        }
      }}
    >
      <button className="min-w-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 py-2 rounded-md text-center">
        {text}
      </button>
    </Link>
  );
};

export default PaymentLink;
