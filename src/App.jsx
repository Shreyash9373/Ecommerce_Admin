import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoutes.jsx";
import ManageCategory from "./Pages/ManageCategory.jsx";
import ManageProduct from "./Pages/ManageProduct.jsx";
import ManageVendor from "./Pages/ManageVendor.jsx";
import ManageUser from "./Pages/ManageUser.jsx";
import Login from "./Auth/Login";
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import Dashboard from "./Pages/Dashboard";
import VendorDetails from "./Pages/VendorDetails.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import NotFound from "./Pages/NotFound";
import ResetPassword from "./Pages/ResetPassword.jsx";
import useAuthCheck from "./Auth/useAuthCheck.jsx";
import ManageOrder from "./Pages/ManageOrder.jsx";
import AdminChatBot from "./Components/AdminChatBot.jsx";

const AppContent = () => {
  useAuthCheck();
  const { isAuthenticated, loading } = useSelector((state) => state.admin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Redirect authenticated users to /dashboard when accessing login or home
  useEffect(() => {
    if (
      isAuthenticated &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="mt-16">
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
      {isAuthenticated && <Navbar />}
      <div className="flex h-full">
        {isAuthenticated && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={setIsSidebarOpen} />
        )}
        {isAuthenticated && <AdminChatBot />}

        <div
          className={`flex-1 transition-all ${isAuthenticated ? "md:ml-64" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manageCategory" element={<ManageCategory />} />
              <Route path="/manageProducts" element={<ManageProduct />} />
              <Route path="/manageProducts/:id" element={<ProductDetails />} />
              <Route path="/manageVendor" element={<ManageVendor />} />
              <Route path="/manageOrder" element={<ManageOrder />} />

              <Route path="/manageVendor/:id" element={<VendorDetails />} />
              <Route path="/manageUser" element={<ManageUser />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
