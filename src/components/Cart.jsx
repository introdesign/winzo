import React from "react";

const Cart = ({ cart, onCheckout, onRemove }) => (
  <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold mb-6">Cart</h2>
    {cart.length === 0 ? (
      <div className="text-gray-600">Your cart is empty.</div>
    ) : (
      <>
        <ul className="p-0 list-none">
          {cart.map((item, idx) => (
            <li
              key={idx}
              className="mb-3 border-b border-gray-200 pb-2 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <strong>{item.service}</strong>
                <span
                  className="text-red-500 cursor-pointer font-medium"
                  onClick={() => onRemove(idx)}
                >
                  Remove
                </span>
              </div>
              <div className="text-sm text-gray-700">
                Length: {item.length} ft, Width: {item.width} ft
              </div>
              <div className="text-sm text-gray-700">
                Area: {item.area} sq ft
              </div>
              <div className="text-sm text-gray-900 font-semibold">
                Price: RM {item.price}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 font-bold text-lg">
          Total: RM {cart.reduce((sum, i) => sum + Number(i.price), 0).toFixed(2)}
        </div>
        <button
          className="mt-4 w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
          onClick={onCheckout}
        >
          Proceed to Payment
        </button>
      </>
    )}
  </div>
);

export default Cart;