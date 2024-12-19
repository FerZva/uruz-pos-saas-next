"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingProps } from "../types/interfaces";
import Link from "next/link";
import PaymentLink from "./PaymentLink";

const pricingList: PricingProps[] = [
  {
    nickName: "Enterprise Basic",
    unit_amount: 45,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 1 store",
      "24/7 Customer service",
      "Full Access",
      "Monthly",
    ],
    paymentLink: "https://buy.stripe.com/test_eVa4gs72CcQ14k89AD",
    href: "/api/auth/login",
    billing: "/month",
  },
  {
    nickName: "Enterprise Plus",
    unit_amount: 75,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 3 store",
      "24/7 Customer service",
      "Full Access",
      "Monthly",
    ],
    paymentLink: "https://buy.stripe.com/test_6oEdR23Qq8zL2c028c",
    href: "/api/auth/login",
    billing: "/month",
  },
  {
    nickName: "Enterprise Premium",
    unit_amount: 99,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 6 store",
      "24/7 Customer service",
      "Full Access",
      "Monthly",
    ],
    paymentLink: "https://buy.stripe.com/test_9AQ7sEgDccQ1cQE5kr",
    href: "/api/auth/login",
    billing: "/month",
  },
  {
    nickName: "Enterprice Basic",
    unit_amount: 300,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 1 store",
      "24/7 Customer service",
      "Full Access",
      "Yearly",
    ],
    paymentLink: "https://buy.stripe.com/test_fZebIUfz8bLX17W6ox",
    href: "/api/auth/login",
    billing: "/year",
  },
  {
    nickName: "Enterprice Plus",
    unit_amount: 660,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 3 store",
      "24/7 Customer service",
      "Full Access",
      "Yearly",
    ],
    paymentLink: "https://buy.stripe.com/test_9AQ7sEgDccQ1cQE5kr",
    href: "/api/auth/login",
    billing: "/year",
  },
  {
    nickName: "Enterprice Premium",
    unit_amount: 948,
    buttonText: "Get Started",
    marketing_features: [
      "Up to 6 store",
      "24/7 Customer service",
      "Full Access",
      "Yearly",
    ],
    paymentLink: "https://buy.stripe.com/test_14k5kw72C8zLg2Q7sA",
    href: "/api/auth/login",
    billing: "/year",
  },
];

export default function Pricing() {
  const [prices, setPrices] = useState<any[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Filtra los planes según el ciclo de facturación seleccionado
  const filteredPricingList = pricingList.filter((plan) =>
    billingCycle === "monthly"
      ? plan.billing === "/month"
      : plan.billing === "/year"
  );

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        const data = await res.json();
        setPrices(data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    }
    fetchPrices();
  }, []);

  return (
    <section className="py-20">
      <div className="container m-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-blue-300 md:text-4xl"
        >
          Transparent Pricing for Every Business
        </motion.h2>
        {/* Switch para alternar entre Monthly y Yearly */}
        <div className="flex justify-center mb-8">
          <span
            className={`mr-2 font-medium ${
              billingCycle === "monthly" ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={billingCycle === "monthly"}
              onChange={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <span
            className={`ml-2 font-medium ${
              billingCycle === "yearly" ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Yearly
          </span>
        </div>
        <div className="grid gap-8 md:grid-cols-3 m-auto">
          {filteredPricingList.map((plan, index) => (
            <motion.div
              key={plan.nickName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-1 shadow-lg"
            >
              <div className="h-full rounded-lg bg-gray-900/90 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-xl font-semibold text-blue-300">
                  {plan.nickName}
                </h3>
                <div className="mb-4 text-3xl font-bold text-white">
                  <ul className="mb-6 space-y-4">
                    {plan.marketing_features?.map(
                      (feature: any, index: number) => (
                        <li
                          className="flex items-center gap-2 text-gray-300 text-[20px]"
                          key={index}
                        >
                          <Check className="h-5 w-5 text-blue-400" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="mb-4 text-3xl font-bold text-white">
                  ${plan.unit_amount!}
                </div>
                {plan.paymentLink ? (
                  <PaymentLink
                    href={plan.href}
                    paymentLink={plan.paymentLink}
                    text={plan.buttonText}
                  />
                ) : (
                  <Button disabled className="w-full bg-gray-500 text-white">
                    Not Available
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
