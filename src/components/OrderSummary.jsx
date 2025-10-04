import React from "react";

const OrderSummary = ({ cart, onCartClick }) => (
  <div
    className=" bottom-4 right-4 z-40 bg-white rounded-xl shadow-lg px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[80px] flex items-center cursor-pointer"
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