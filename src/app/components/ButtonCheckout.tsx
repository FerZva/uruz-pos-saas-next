"use client";

import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type ButtonCheckoutProps = {
  priceId: string;
};

function ButtonCheckout({ priceId }: ButtonCheckoutProps) {
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  const handleCheckout = async () => {
    if (!user) {
      // Guarda solo el priceId en localStorage
      localStorage.setItem("priceId", priceId);
      router.push("/api/auth/login"); // Redirige a la página de inicio de sesión
      return;
    }

    // Usuario autenticado, inicia el checkout
    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        priceId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url; // Redirige al enlace de Stripe
    } else {
      console.error("Error al iniciar el checkout:", await response.text());
      alert("No se pudo procesar el checkout. Intenta de nuevo.");
    }
  };

  return (
    <button
      className="bg-sky-500 text-white px-4 py-2 rounded"
      onClick={handleCheckout}
    >
      Buy
    </button>
  );
}

export default ButtonCheckout;
