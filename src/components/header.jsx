import React from "react";


const Header = ({ isAdmin, onOrderHistoryClick, pendingOrdersCount = 0, onAdminDashboardClick, onRevenueDashboardClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <nav className="flex gap-4 items-center px-6 py-4 bg-blue-400 text-gray-900 rounded-b-xl shadow">
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
      <button 
        onClick={onOrderHistoryClick}
        className="text-gray-900 hover:underline font-medium bg-transparent border-none cursor-pointer relative"
      >
        Order History
        {pendingOrdersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingOrdersCount}
          </span>
        )}
      </button>
      {isAdmin && (
        <>
          <button 
            onClick={onAdminDashboardClick}
            className="text-gray-900 hover:underline font-medium bg-transparent border-none cursor-pointer"
          >
            Admin Dashboard
          </button>
          <button 
            onClick={onRevenueDashboardClick}
            className="text-gray-900 hover:underline font-medium bg-transparent border-none cursor-pointer"
          >
            Revenue
          </button>
          <a href="#" className="text-gray-900 hover:underline font-medium">Product</a>
        </>
      )}
    </nav>
  );
};

export default Header;




