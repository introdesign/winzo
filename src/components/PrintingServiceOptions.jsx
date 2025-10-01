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
}) => (
  <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold mb-6">Printing Service Options</h2>
    <div className="mb-4">
      <label className="font-semibold">
        Service:&nbsp;
        <select
          className="border rounded px-2 py-1 ml-1"
          value={selectedService.name}
          onChange={e => {
            const svc = services.find(s => s.name === e.target.value);
            setSelectedService(svc);
            setLength("");
            setWidth("");
          }}
        >
          {services.map(service => (
            <option key={service.name} value={service.name}>
              {service.name} ({service.unit}, RM {service.price})
            </option>
          ))}
        </select>
      </label>
    </div>
    {(isBanner || isSticker) && (
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <label className="flex-1">
          Width (ft):&nbsp;
          <input
            type="number"
            min="0"
            value={width}
            onChange={e => setWidth(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex-1">
          Length (ft):&nbsp;
          <input
            type="number"
            min="0"
            value={length}
            onChange={e => setLength(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    )}
    {isAreaBased && !isBanner && !isSticker && (
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <label className="flex-1">
          Length (ft):&nbsp;
          <input
            type="number"
            min="0"
            value={length}
            onChange={e => setLength(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </label>
        <label className="flex-1">
          Width (ft):&nbsp;
          <input
            type="number"
            min="0"
            value={width}
            onChange={e => setWidth(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    )}
    {isLengthBased && (
      <div className="mb-4">
        <label>
          Length (ft):&nbsp;
          <input
            type="number"
            min="0"
            value={length}
            onChange={e => setLength(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
    )}
    {(isBanner || isSticker) && length && width && (
      <div className="mb-4">
        <strong>Area: </strong>
        {area} sq ft
      </div>
    )}
    <div className="mb-4">
      <strong>Total Price: </strong>
      {isBanner || isSticker
        ? (length && width
            ? `RM ${totalPrice}`
            : "Enter length and width")
        : isAreaBased
          ? (length && width
              ? `RM ${totalPrice}`
              : "Enter length and width")
          : isLengthBased
            ? (length ? `RM ${totalPrice}` : "Enter length")
            : `RM ${totalPrice}`}
    </div>
    <button
      className="mt-2 w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
      onClick={handleAddToCart}
      disabled={
        (isBanner || isSticker) ? !(length && width) :
        isAreaBased ? !(length && width) :
        isLengthBased ? !length : true
      }
    >
      Add to Cart
    </button>
    <button
      className="mt-2 w-full py-3 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600 transition"
      onClick={() => setShowCart(true)}
      disabled={cart.length === 0}
    >
      View Cart
    </button>
  </div>
);

export default PrintingServiceOptions;