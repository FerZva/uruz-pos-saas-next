"use client";
type ButtonCheckoutProps = {
  priceId: string;
};

function ButtonCheckout({ priceId }: ButtonCheckoutProps) {
  return (
    <button
      className="bg-sky-500 text-white px-4 py-2 rounded"
      onClick={async () => {
        const rest = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({
            priceId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await rest.json();
        window.location.href = data.url;
      }}
    >
      buy
    </button>
  );
}

export default ButtonCheckout;
