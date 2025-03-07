import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import ManageCategory from "./Pages/ManageCategory.jsx";
import ManageProduct from "./Pages/ManageProduct.jsx";
import ManageVendor from "./Pages/ManageVendor.jsx";
import ManageUser from "./Pages/ManageUser.jsx";
import Login from "./Auth/Login";
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx"; // Import Sidebar
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  return (
    <Router>
      <ToastContainer />
      {isAuthenticated && <Navbar />} {/* Navbar visible after login */}
      <div className="flex h-screen">
        {/* Sidebar (Hidden behind navbar) */}
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />}

        {/* Main Content Area */}
        <div className={`flex-1 transition-all p-6 ${isAuthenticated ? "md:ml-64" : ""}`}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes (Require Authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manageCategory" element={<ManageCategory />} />
              <Route path="/manageProduct" element={<ManageProduct />} />
              <Route path="/manageVendor" element={<ManageVendor />} />
              <Route path="/manageUser" element={<ManageUser />} />
            </Route>

            {/* Catch-All 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
