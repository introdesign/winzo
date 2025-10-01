import React from "react";

const OrderSummary = ({ cart, onCartClick }) => (
  <div
    className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-lg px-6 py-4 min-w-[80px] flex items-center cursor-pointer"
    onClick={onCartClick}
    title="View Cart"
  >
    <span className="text-2xl mr-2">🛒</span>
    <span className="font-bold text-lg text-gray-900">
      {cart && cart.length ? cart.length : 0}
    </span>
  </div>
);

export default OrderSummary;