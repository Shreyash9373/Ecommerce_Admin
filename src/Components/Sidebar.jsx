import axios from "axios";
import { useState } from "react";
import {
  FaShoppingCart,
  FaCubes,
  FaClipboardList,
  FaUser,
  FaUsers,
  FaChartPie,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { MdCategory } from "react-icons/md";

import { HiHome, HiMenuAlt3 } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutAdmin } from "../redux/slices/adminSlice";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const LogoutAdmin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        dispatch(logoutAdmin());
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(error);
    }
  };
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed mt-12 bottom-0  top-0 left-0 w-64 text-lg flex flex-col items-start border-r border-gray-300 bg-white min-h-screen p-5 shadow-lg z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ transition: "transform 0.3s ease-in-out" }} // Ensure smooth transition
      >
        {/* <div className="flex justify-between items-center w-full mb-8 mt-4 md:mt-0">
          <h2 className="text-xl font-semibold text-gray-700">Menu</h2>
          <button
            className="md:hidden text-gray-500"
            onClick={() => toggleSidebar(false)}
          >
            ✖
          </button>
        </div> */}

        <nav className="min-w-full h-[90%] flex flex-col">
          <ul className="flex-grow space-y-4">
            {[
              { to: "/dashboard", icon: <HiHome />, label: "Dashboard" },
              {
                to: "/manageCategory",
                icon: <MdCategory />,
                label: "Category",
              },
              { to: "/manageVendor", icon: <FaUser />, label: "Vendors" },
              {
                to: "/manageProducts",
                icon: <FaShoppingCart />,
                label: "Products",
              },
              {
                to: "/manageOrder",
                icon: <FaClipboardList />,
                label: "Orders",
              },
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

          {/* ✅ Logout Button at Bottom */}
          <button
            onClick={() => LogoutAdmin()}
            className="px-2 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 mt-auto md:hidden"
          >
            Logout
          </button>
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
        <button
          className="text-2xl text-white"
          onClick={() => toggleSidebar(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
