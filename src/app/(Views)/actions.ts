"use server";
import prisma from "@/app/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function isUserSubscribed() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false };

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!existingUser) return { success: false };

  return {
    success: true,
    subscribed:
      existingUser.plan === "enterpriseBasicMonthly" ||
      existingUser.plan === "enterpriseBasicYearly" ||
      existingUser.plan === "enterprisePlusMonthly" ||
      existingUser.plan === "enterprisePlusYearly" ||
      existingUser.plan === "enterprisePremiumMonthly" ||
      existingUser.plan === "enterprisePremiumYearly",
  };
}
