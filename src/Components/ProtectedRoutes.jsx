import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthCheck from "../Auth/useAuthCheck.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.admin);
  // const { isAuthenticated, loading } = useAuthCheck();

  // console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  // console.log("ProtectedRoute loading:", loading);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  // const accessToken = Cookies.get("accessToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
