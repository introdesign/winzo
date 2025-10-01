import React from "react";

const Header = ({ isAdmin }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <nav className="flex gap-4 items-center px-6 py-4 bg-yellow-400 text-gray-900 rounded-b-xl shadow">
      <span
        className={`font-bold transition-all duration-200 cursor-pointer text-gray-900 ${hovered ? "text-3xl" : "text-2xl"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Winzo
      </span>
      <a href="#" className="text-gray-900 hover:underline font-medium">Home</a>
      <a href="#" className="text-gray-900 hover:underline font-medium">About</a>
      <a href="#" className="text-gray-900 hover:underline font-medium">Contact</a>
      {isAdmin && (
        <a href="#" className="text-gray-900 hover:underline font-medium">Product</a>
      )}
    </nav>
  );
};

export default Header;