import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../redux/slices/adminSlice";
import { toast } from "react-toastify";
import { toggleTheme } from "../redux/slices/adminSlice";
import axios from "axios";
import bell from "../assets/bell.svg";
import bell_white from "../assets/bell_white.svg";
import socket from "../socket.js";
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

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

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getAllNotifications`,
          { withCredentials: true }
        );
        setNotifications(response.data.data);

        // Count how many are unread (if backend tracks read/unread)
        const unreadCount = response.data.data.filter((n) => !n.isRead).length;
        setUnreadCount(unreadCount);
      } catch (err) {
        console.log("Error fetching notifications", err);
      }
    };

    fetchInitialNotifications();

    // ✅ Listen for new notifications
    socket.on("connection", () => {
      console.log("✅ Connected to WebSocket server");
    });
    socket.on("newNotification", (data) => {
      console.log("New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const toggleDropdown = async () => {
    setShowDropdown(!showDropdown);

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/markNotificationsAsRead`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };
  const deleteAllNotifications = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/deleteAllNotifications`,
        { withCredentials: true }
      );
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared!");
    } catch (err) {
      toast.error("Failed to clear notifications.");
    }
  };
  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/deleteNotification/${id}`,
        { withCredentials: true }
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <nav>
      {/* Navbar */}
      <div className="fixed top-0 bg-blue-800 text-white shadow-md z-50 w-full py-3 px-2 flex items-center dark:bg-gray-800 dark:border dark:border-gray-600">
        <NavLink to="/dashboard" className="text-xl font-bold ml-auto md:ml-0 ">
          <p className="">Admin Dashboard</p>
        </NavLink>
        <div className="flex ml-auto items-center gap-4">
          {/* Notification Button */}
          <div className="relative">
            <button onClick={toggleDropdown} className="relative">
              <img
                src={theme === "dark" ? bell_white : bell}
                alt="Notifications"
                className="w-6 h-6"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-700 shadow-lg rounded-md z-50">
                <div className="flex justify-between items-center p-2 border-b dark:border-gray-600">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={deleteAllNotifications}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                ) : (
                  <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <li
                        key={notif._id}
                        className="flex justify-between items-start p-3 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600"
                      >
                        <span>{notif.message || "New notification!"}</span>
                        <button
                          onClick={() => deleteNotification(notif._id)}
                          className="text-xs text-red-500 ml-2 hover:text-red-700"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button
            className="hidden md:block border rounded-full mx-3 p-2 hover:bg-gray-400 bg-gray-500"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle Dark Mode"
          >
            <img
              src={theme === "dark" ? sun : moon}
              alt="toggle-theme"
              className="w-6 h-6  "
            />
          </button>
          <button
            onClick={() => LogoutAdmin()}
            className="hidden md:block  text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
