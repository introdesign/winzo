import React from "react";

const products = [
  "Inkjet Printing",
  "DTF Printing",
  "Display System",
  "Fabric Display",
  "Mounting",
  "Signage",
  "Framed Poster",
  "Magnet Sheet",
  "Acrylic Sheet",
  "Material Supply"
];

const ProductSidebar = () => (
  <aside className="w-full md:w-64 bg-gray-900 text-white rounded-xl p-0.5 md:my-8 md:ml-8 md:mr-2 font-sans">
    <div className="font-bold text-base px-4 py-3 border-b border-gray-700 rounded-t-xl bg-gray-900">
      Products
    </div>
    {products.map((prod, idx) => (
      <div
        key={prod}
        className={`px-4 py-3 flex justify-between items-center font-medium border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition
          ${idx === products.length - 1 ? "border-b-0 rounded-b-xl" : ""}`}
      >
        <span>{prod}</span>
        <span className="font-bold">{'>'}</span>
      </div>
    ))}
  </aside>
);

export default ProductSidebar;