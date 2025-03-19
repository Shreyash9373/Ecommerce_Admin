import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../redux/slices/adminSlice";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <nav>
      {/* Navbar */}
      <div className="fixed top-0 bg-blue-800 text-white shadow-md z-50 w-full py-3 px-2 flex items-center">
        <NavLink to="/dashboard" className="text-xl font-bold ml-auto md:ml-0 ">
          <p className="">Admin Dashboard</p>
        </NavLink>
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
