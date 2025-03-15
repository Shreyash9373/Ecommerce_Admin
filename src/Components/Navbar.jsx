import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import {
  FaShoppingCart,
  FaCubes,
  FaClipboardList,
  FaUser,
  FaUsers,
  FaChartPie,
} from "react-icons/fa";
import { HiHome } from "react-icons/hi";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav>
      {/* Navbar */}
      <div className="fixed top-0 bg-blue-800 text-white shadow-md z-50 w-full py-3 px-2 flex justify-between items-center">
        {/* Toggle Sidebar Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold">
          Admin Dashboard
        </NavLink>
      </div>

      {/* Mobile Sidebar */}
      {/* {sidebarOpen && (
        <div className="fixed top-0 bottom-0 min-w-full left-0 w-64 h-full bg-teal-500 shadow-lg p-5 z-50 md:hidden">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <HiX />
          </button>
          <ul className="mt-8 space-y-4">
            <li>
              <NavLink
                to="/"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <HiHome className="text-lg" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/manageCategory"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaShoppingCart className="text-lg" />
                ManageCategory
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaCubes className="text-lg" />
                Category
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaClipboardList className="text-lg" />
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/users"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="text-lg" />
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/roles"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUsers className="text-lg" />
                Roles
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-500"
                onClick={() => setSidebarOpen(false)}
              >
                <FaChartPie className="text-lg" />
                Reports
              </NavLink>
            </li>
          </ul>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
