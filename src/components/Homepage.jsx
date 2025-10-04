import React, { useState } from "react";
import Header from "./header.jsx";
import ProductSidebar from "./productSidebar.jsx";
import OrderSummary from "./OrderSummary.jsx";
import PrintingServiceOptions from "./PrintingServiceOptions.jsx";
import WhatsAppConfirmation from "./WhatsAppConfirmation.jsx";
import OrderHistory from "./OrderHistory.jsx";

const services = [
  { name: "Banner Printing", price: 3, unit: "per ft" },
  { name: "Sticker Printing", price: 8, unit: "per ft" },
  { name: "Poster Printing", price: 12, unit: "per sq ft" },
  { name: "Business Card", price: 50, unit: "per 100 pcs" }
];

const Homepage = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const [selectedService, setSelectedService] = useState(services[0]);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  // Add refresh trigger state
  const [orderHistoryRefresh, setOrderHistoryRefresh] = useState(0);

  const isBanner = selectedService.name === "Banner Printing";
  const isSticker = selectedService.name === "Sticker Printing";
  const isAreaBased = selectedService.unit.includes("sq ft");
  const isLengthBased = selectedService.unit === "per ft" && !isBanner && !isSticker;

  let totalPrice = 0;
  let area = 0;

  console.log("user",user)

  if ((isBanner || isSticker) && length && width) {
    area = parseFloat(length) * parseFloat(width);
    totalPrice = (area * selectedService.price).toFixed(2);
  } else if (isAreaBased && length && width) {
    totalPrice = (parseFloat(length) * parseFloat(width) * selectedService.price).toFixed(2);
  } else if (isLengthBased && length) {
    totalPrice = (parseFloat(length) * selectedService.price).toFixed(2);
  } else if (!isAreaBased && !isLengthBased && !isBanner && !isSticker) {
    totalPrice = selectedService.price;
  }

  const handleAddToCart = () => {
    if ((isBanner || isSticker) && length && width) {
      setCart([
        ...cart,
        {
          service: selectedService.name,
          length,
          width,
          area,
          price: totalPrice
        }
      ]);
      setLength("");
      setWidth("");
    } else if (isAreaBased && length && width) {
      setCart([
        ...cart,
        {
          service: selectedService.name,
          length,
          width,
          area: (parseFloat(length) * parseFloat(width)).toFixed(2),
          price: totalPrice
        }
      ]);
      setLength("");
      setWidth("");
    } else if (isLengthBased && length) {
      setCart([
        ...cart,
        {
          service: selectedService.name,
          length,
          width: "-",
          area: "-",
          price: totalPrice
        }
      ]);
      setLength("");
    }
    setShowCart(true);
  };

  const handleRemove = idx => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  // Add this function to save orders
  const saveOrderToHistory = (orderData) => {
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const newOrder = {
      id: 'ORD' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      total: orderData.total,
      items: orderData.items,
      paymentMethod: 'WhatsApp Transfer',
      paymentStatus: 'Pending',
      userId: user.uid,
      timestamp: new Date().toISOString()
    };
    existingOrders.push(newOrder);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isAdmin={user?.email === "admin@example.com"} 
        onOrderHistoryClick={() => {
          console.log("Order History clicked!"); // Add this for debugging
          setShowOrderHistory(true);
        }}
      />
      <OrderSummary
        cart={cart}
        onCartClick={() => setShowCart(true)}
        className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-lg px-6 py-4 min-w-[80px] flex items-center cursor-pointer"
      />
      <div className="flex flex-col md:flex-row pt-2 md:pt-8 max-w-7xl mx-auto">
        <div className="w-full md:w-72 md:mr-6 mb-4 md:mb-0">
          <ProductSidebar />
        </div>
        <div className="flex-1 w-full">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to Winzo!</h1>
            {user && (
              <div className="mb-4">
                <p>
                  Hello, <strong>{ user.email}</strong>!
                </p>
                <img src ={user.photoURL} alt="User Photo" className=" w-16 h-16 rounded-full mt-2 "/>
              </div>
            )}
          </div>
          {!showCart && !showPayment && !showOrderHistory && (
            <PrintingServiceOptions
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              length={length}
              setLength={setLength}
              width={width}
              setWidth={setWidth}
              area={area}
              totalPrice={totalPrice}
              handleAddToCart={handleAddToCart}
              isBanner={isBanner}
              isSticker={isSticker}
              isAreaBased={isAreaBased}
              isLengthBased={isLengthBased}
              cart={cart}
              setShowCart={setShowCart}
            />
          )}
          {showCart && !showPayment && (
            <div>
              {/* You may want to use your Cart component here */}
              <div>
                <h2 className="text-xl font-bold mb-4">Cart</h2>
                {cart.map((item, idx) => (
                  <div key={idx} className="mb-2 p-2 border rounded">
                    <div>{item.service}</div>
                    <div>Length: {item.length}</div>
                    <div>Width: {item.width}</div>
                    <div>Area: {item.area}</div>
                    <div>Price: {item.price}</div>
                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="mt-4 w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
                <button
                  className="mt-2 w-full py-2 bg-gray-300 text-black rounded font-semibold hover:bg-gray-200 transition"
                  onClick={() => setShowCart(false)}
                >
                  Back to Printing Service Options
                </button>
              </div>
            </div>
          )}
          {showPayment && !showWhatsApp && (
            <div className="max-w-lg mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <div className="mb-4">Thank you for your order!</div>
              <button
                className="w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                onClick={() => setShowWhatsApp(true)}
              >
                Confirm & Send to WhatsApp
              </button>
            </div>
          )}
          {showWhatsApp && (
            <WhatsAppConfirmation
              cart={cart}
              onBack={() => {
                // Save order to history
                const orderTotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
                saveOrderToHistory({
                  total: orderTotal,
                  items: [...cart]
                });
                
                // Clear states
                setCart([]);
                setShowWhatsApp(false);
                setShowPayment(false);
                setShowCart(false);
                
                // Trigger order history refresh
                setOrderHistoryRefresh(prev => prev + 1);
              }}
            />
          )}
        </div>
      </div>

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto m-4">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Order History</h2>
              <button 
                onClick={() => setShowOrderHistory(false)}
                className="text-gray-500 hover:text-gray-700 text-xl px-2"
              >
                ✕
              </button>
            </div>
            <OrderHistory user={user} refreshTrigger={orderHistoryRefresh} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;