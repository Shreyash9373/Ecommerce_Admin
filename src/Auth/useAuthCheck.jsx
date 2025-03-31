// import { useEffect, useState } from "react";
// import axios from "axios";

// const useAuthCheck = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true); // New loading state

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/checkAuth`,
//           { withCredentials: true }
//         );
//         console.log(
//           "Authenticated from useAuth",
//           response.data.isAuthenticated
//         );
//         setIsAuthenticated(response.data.isAuthenticated);
//       } catch (error) {
//         console.log("Error from checkAuth", error);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false); // Set loading to false after API call
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   return { isAuthenticated, loading, setIsAuthenticated }; // Return both values
// };

// export default useAuthCheck;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuthStatus, setLoading } from "../redux/slices/adminSlice.js";

const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Set loading to true at the start of the check
      dispatch(setLoading(true));

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/checkAuth`,
          { withCredentials: true }
        );

        dispatch(setAuthStatus(response.data.isAuthenticated));
      } catch (error) {
        console.log("Error from checkAuth", error);
        dispatch(setAuthStatus(false));
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return { isAuthenticated, loading };
};

export default useAuthCheck;
