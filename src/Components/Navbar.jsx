import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../redux/slices/adminSlice";
import { toast } from "react-toastify";
import { toggleTheme } from "../redux/slices/adminSlice";
import axios from "axios";
import useDarkMode from "../hooks/useDarkMode";
import moon from "../assets/moon.svg";
import sun from "../assets/sun.svg";
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [theme, setTheme] = useDarkMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

  const theme = useSelector((state) => state.admin.theme);

  // const theme = useSelector((state) => state.admin.theme);
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
    <nav>
      {/* Navbar */}
      <div className="fixed top-0 bg-blue-800 text-white shadow-md z-50 w-full py-3 px-2 flex items-center dark:bg-gray-800 dark:border dark:border-gray-600">
        <NavLink to="/dashboard" className="text-xl font-bold ml-auto md:ml-0 ">
          <p className="">Admin Dashboard</p>
        </NavLink>
        <button
          onClick={() => dispatch(toggleTheme())}
          title="Toggle Dark Mode"
        >
          <img
            src={theme === "dark" ? sun : moon}
            alt="toggle-theme"
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={() => LogoutAdmin()}
          className="hidden md:block ml-auto text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
