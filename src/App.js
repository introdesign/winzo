import React, { useState } from "react";
import logo from "./components/assets/winzoprint logo.jpg";
import FirebaseAuth from "./components/FirebaseAuth";
import Homepage from "./components/Homepage";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [hover, setHover] = useState(false);
  const [user, setUser] = useState(null);

  // Show landing page only if no user is logged in
  if (showLanding && !user) {
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
            }, 400);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </div>
    );
  }

  // Show FirebaseAuth if not logged in (after landing)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <FirebaseAuth onLogin={(firebaseUser) => setUser(firebaseUser)} />
      </div>
    );
  }

  // Show Homepage after login (no way to go back to landing)
  return <Homepage user={user} />;
};

export default App;