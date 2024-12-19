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
      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem("stripePaymentLink", paymentLink);
        }
      }}
    >
      {text}
    </Link>
  );
};

export default PaymentLink;
