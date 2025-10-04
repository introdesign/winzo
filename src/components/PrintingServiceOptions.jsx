import React from "react";

const PrintingServiceOptions = ({
  services,
  selectedService,
  setSelectedService,
  length,
  setLength,
  width,
  setWidth,
  area,
  totalPrice,
  handleAddToCart,
  isBanner,
  isSticker,
  isAreaBased,
  isLengthBased,
  cart,
  setShowCart
}) => {
  return (
    <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Printing Service Options</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Service:</label>
        <select
          value={selectedService.name}
          onChange={(e) => {
            const service = services.find(s => s.name === e.target.value);
            setSelectedService(service);
          }}
          className="w-full p-3 border rounded-lg"
        >
          {services.map(service => (
            <option key={service.name} value={service.name}>
              {service.name} ({service.unit}, RM {service.price})
            </option>
          ))}
        </select>
      </div>

      {(isBanner || isSticker || isAreaBased || isLengthBased) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {(isBanner || isSticker || isAreaBased) && (
            <div>
              <label className="block text-sm font-medium mb-2">Width (ft):</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter width"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Length (ft):</label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter length"
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <span className="text-lg font-semibold">
          Total Price: {totalPrice ? `RM ${totalPrice}` : "Enter length and width"}
        </span>
      </div>

      <div className="space-y-3">
        <button
          className="w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
          onClick={handleAddToCart}
          disabled={!totalPrice || totalPrice === "0.00"}
        >
          Add to Cart
        </button>
        
        <button
          className="w-full py-3 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600 transition"
          onClick={() => setShowCart(true)}
        >
          View Cart ({cart.length})
        </button>
      </div>
    </div>
  );
};
export default PrintingServiceOptions;
