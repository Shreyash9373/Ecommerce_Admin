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
import VendorDetails from "./Pages/VendorDetails.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import NotFound from "./Pages/NotFound";
import ResetPassword from "./Pages/ResetPassword.jsx";
import useAuthCheck from "./Auth/useAuthCheck.jsx";

const App = () => {
  useAuthCheck();
  const { isAuthenticated, loading } = useSelector((state) => state.admin);
  // const { isAuthenticated } = useAuthCheck();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  // Call useAuthCheck once at the app level to initialize authentication

  return (
    <div className="mt-16">
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{
            maxWidth: "300px",
            borderRadius: "4px",
            fontSize: "0.875rem",
            padding: "8px",
            color: "#050505",
            fontFamily: "sans-serif",
          }}
        />
        {isAuthenticated && (
          <div className="">
            <Navbar />
          </div>
        )}{" "}
        {/* Navbar visible after login */}
        <div className="flex h-full">
          {/* Sidebar (Hidden behind navbar) */}
          {isAuthenticated && (
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
          )}

          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all  ${isAuthenticated ? "md:ml-64" : ""}`}
          >
            <Routes>
              {/* Public Route */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset" element={<ResetPassword />} />

              {/* Protected Routes (Require Authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manageCategory" element={<ManageCategory />} />
                <Route path="/manageProducts" element={<ManageProduct />} />
                <Route
                  path="/manageProducts/:id"
                  element={<ProductDetails />}
                />
                <Route path="/manageVendor" element={<ManageVendor />} />
                <Route path="/manageVendor/:id" element={<VendorDetails />} />
                <Route path="/manageUser" element={<ManageUser />} />
              </Route>

              {/* Catch-All 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
