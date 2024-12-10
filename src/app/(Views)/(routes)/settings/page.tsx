import React from "react";
import prisma from "@/app/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const SettingsPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");

  const userProfile = await prisma.user.findUnique({ where: { id: user.id } });
  if (userProfile?.plan === "free") return redirect("/");

  return (
    <div>
      <Link href={process.env.NEXT_PULIC_STRIPE_CUSTOMER_PORTAL_URL!}>
        <button>Manage Billing Portal</button>
      </Link>
    </div>
  );
};

export default SettingsPage;
