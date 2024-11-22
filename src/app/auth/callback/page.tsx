"use client";
import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatus } from "./actions";

const CallBackPage = () => {
  const router = useRouter();
  // const { user } = useKindeBrowserClient();
  const { data } = useQuery({
    queryKey: ["checkAuthStatus"],
    queryFn: async () => checkAuthStatus(),
  });

  useEffect(() => {
    const priceId = localStorage.getItem("priceId");

    if (data?.success && priceId) {
      // Realiza la solicitud POST para generar la sesión de Stripe
      const createCheckout = async () => {
        const response = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({ priceId }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const { url } = await response.json();
          localStorage.removeItem("priceId"); // Limpia el localStorage
          router.push(url); // Redirige al checkout
        } else {
          console.error("Error al crear sesión de Stripe");
          router.push("/"); // Redirige a la página de suscripción
        }
      };

      createCheckout();
    } else if (data?.success === false) {
      router.push("/"); // Redirige al inicio si no está autenticado
    }
  }, [router, data]);

  if (data?.success) router.push("/dashboard");
  return (
    <div className="mt-20 w-full flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-10 h-10 animate-spin text-primary" />
        <h3 className="text-xl font-bold">Redirecting...</h3>
        <p>Please wait...</p>
      </div>
    </div>
  );
};

export default CallBackPage;
