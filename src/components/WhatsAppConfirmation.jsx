import React from "react";

const WhatsAppConfirmation = ({ cart, onBack }) => {
  const orderDetails = cart.map((item, idx) =>
    `${idx + 1}. ${item.service} - Length: ${item.length} ft, Width: ${item.width} ft${item.area && item.area !== "-" ? `, Area: ${item.area} sq ft` : ""} - RM ${item.price}`
  ).join("%0A");

  const total = cart.reduce((sum, i) => sum + Number(i.price), 0).toFixed(2);

  const message = `Hello, I would like to confirm my order:%0A${orderDetails}%0A%0ATotal: RM ${total}`;

  const whatsappUrl = `https://wa.me/60139990242?text=${message}`;

  return (
    <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">Order Confirmed</h2>
      <div className="mb-4">Thank you for your order!</div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition mb-4"
      >
        Send Order to WhatsApp
      </a>
      <button
        className="w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
        onClick={onBack}
      >
        Back to Services
      </button>
    </div>
  );
};

export default WhatsAppConfirmation;