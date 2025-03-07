import { useState } from "react";
import {
  FaShoppingCart,
  FaCubes,
  FaClipboardList,
  FaUser,
  FaUsers,
  FaChartPie,
} from "react-icons/fa";
import { HiHome, HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed  top-0 left-0 w-64 text-lg flex flex-col items-start border-r border-gray-300 bg-white h-screen p-5 shadow-lg z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ transition: "transform 0.3s ease-in-out" }} // Ensure smooth transition
      >
        {/* <div className="flex justify-between items-center w-full mb-8 mt-4 md:mt-0">
          <h2 className="text-xl font-semibold text-gray-700">Menu</h2>
          <button className="md:hidden text-gray-500" onClick={() => toggleSidebar(false)}>
            ✖
          </button>
        </div> */}

        <nav className=" w-full">
          <ul className=" h-full space-y-4">
            {[
              { to: "/", icon: <HiHome />, label: "Dashboard" },
              { to: "/ecommerce", icon: <FaShoppingCart />, label: "Ecommerce" },
              { to: "/category", icon: <FaCubes />, label: "Category" },
              { to: "/orders", icon: <FaClipboardList />, label: "Orders" },
              { to: "/users", icon: <FaUser />, label: "Users" },
              { to: "/roles", icon: <FaUsers />, label: "Roles" },
              { to: "/reports", icon: <FaChartPie />, label: "Reports" },
            ].map(({ to, icon, label }) => (
              <li key={to} className="w-full">
                <Link
                  to={to}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md w-full hover:bg-gray-100 md:mt-0 md:text-lg text-xl"
                  onClick={() => toggleSidebar(false)}
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => toggleSidebar(false)}
        ></div>
      )}

      {/* Hamburger Menu (Mobile Only) */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button className="text-2xl text-gray-700" onClick={() => toggleSidebar(!isOpen)}>
          <HiMenuAlt3 />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
