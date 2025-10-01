import React, { useState } from "react";
import Header from "./components/header.jsx";
import ProductSidebar from "./components/productSidebar.jsx";
import logo from "./components/assets/winzoprint logo.jpg";
import Cart from "./components/Cart.jsx";
import OrderSummary from "./components/OrderSummary.jsx";
import PrintingServiceOptions from "./components/PrintingServiceOptions.jsx";
import WhatsAppConfirmation from "./components/WhatsAppConfirmation.jsx";

const services = [
  { name: "Banner Printing", price: 3, unit: "per ft" },
  { name: "Sticker Printing", price: 8, unit: "per ft" },
  { name: "Poster Printing", price: 12, unit: "per sq ft" },
  { name: "Business Card", price: 50, unit: "per 100 pcs" }
];

const users = [
  { username: "admin", password: "admin123" },
  { username: "user", password: "user123" }
];

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      onLogin(username);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg min-w-[300px] w-full max-w-xs"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full p-2 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [hover, setHover] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const [selectedService, setSelectedService] = useState(services[0]);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const isBanner = selectedService.name === "Banner Printing";
  const isSticker = selectedService.name === "Sticker Printing";
  const isAreaBased = selectedService.unit.includes("sq ft");
  const isLengthBased = selectedService.unit === "per ft" && !isBanner && !isSticker;

  let totalPrice = 0;
  let area = 0;

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

  if (showLanding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-400">
        <img
          src={logo}
          alt="Winzo Logo"
          className={`w-80 max-w-[80vw] mb-8 rounded-full border-8 border-gray-900 shadow-xl transition-transform duration-400 ${
            hover ? "scale-110 -rotate-3 shadow-2xl" : ""
          }`}
          onClick={() => {
            setHover(true);
            setTimeout(() => {
              setShowLanding(false);
              setShowLogin(true);
            }, 400);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>
    );
  }

  if (showLogin && !user) {
    return <Login onLogin={u => { setUser(u); setShowLogin(false); }} />;
  }

  // Main app after login
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header isAdmin={user === "admin"} />
      <OrderSummary
        cart={cart}
        onCartClick={() => setShowCart(true)}
        className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-lg px-6 py-4 min-w-[80px] flex items-center cursor-pointer"
      />
      {/* Responsive layout: flex-col on mobile, flex-row on md+ */}
      <div className="flex flex-col md:flex-row pt-2 md:pt-8 max-w-7xl mx-auto">
        {/* ProductSidebar on top for mobile, left for desktop */}
        <div className="w-full md:w-72 md:mr-6 mb-4 md:mb-0">
          <ProductSidebar />
        </div>
        <div className="flex-1 w-full">
          {!showCart && !showPayment && (
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
              <Cart
                cart={cart}
                onCheckout={handleCheckout}
                onRemove={handleRemove}
              />
              <button
                className="mt-4 w-full py-3 bg-gray-900 text-white rounded font-semibold hover:bg-gray-800 transition"
                onClick={() => setShowCart(false)}
              >
                Back to Printing Service Options
              </button>
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
                setCart([]);
                setShowWhatsApp(false);
                setShowPayment(false);
                setShowCart(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
