import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage, setTotalPages } from "../redux/slices/paginationSlice";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";

const ManageProduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentPage, recordsPerPage, totalPages } = useSelector(
    (state) => state.pagination
  );
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [products, setproducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); //  Search Query
  const [filteredProducts, setFilteredProducts] = useState([]); //  Filtered Categories
  const [loading, setLoading] = useState(false);

  //Pagination logic
  // totalPages = Math.ceil(products.length / recordsPerPage);
  dispatch(setTotalPages(Math.ceil(products.length / recordsPerPage)));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentproducts = filteredProducts.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handleStatusChange = (event) => {
    const selectedValue = event.target.value;
    // setStatus(selectedValue);
    // console.log(status);
    navigate(`/manageProducts?status=${selectedValue}`);
    // onChange(selectedValue); // Notify parent component (if needed)
  };

  //useeffect to set default dropdown value based on query param
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const queryStatus = params.get("status");

  // Update default dropdown if query param exists
  //   if (queryStatus) {
  //     setStatus(queryStatus);
  //   }
  // }, [location.search]);

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const queryStatus = params.get("status") || "pending";
        if (queryStatus !== status) setStatus(queryStatus); // keep UI dropdown synced
        let endpoint = "";
        if (queryStatus === "pending") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getPendingProducts`;
        } else if (queryStatus === "approved") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getApprovedProducts`;
        } else {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getRejectedProducts`;
        }

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });
        console.log("Response", response.data.data);
        setproducts(response.data.data);
        setFilteredProducts(response.data.data);
        //  console.log("Pendingproducts", products);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchproduct();
  }, [dispatch, recordsPerPage, location.search]);

  //  Search Functionality
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        (product.name?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (product.category?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (product.subCategory?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (product.brand?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const approveStatus = async (productId) => {
    try {
      setLoading(true);
      console.log("pid", productId);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/approveProduct/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/manageProducts?status=approved");
      toast.success("Product Approved Successfully");
      console.log("ApprovedResponse", response.data);
    } catch (error) {
      toast.error("Error approving product");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const rejectStatus = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/rejectProduct/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/manageProducts?status=rejected");
      toast.success("Product Rejected Successfully");
      console.log("RejectedResponse", response.data);
    } catch (error) {
      toast.error("Error rejecting product");
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-4 px-1 bg-white shadow-lg rounded-lg ">
      <h1 className="text-3xl font-semibold mb-2 text-gray-800">Products</h1>
      <p className="text-gray-600">List of products</p>
      {/*  Search Input */}
      <input
        type="text"
        placeholder="Search by name,category,subCategory or brand..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-400 my-3"
      />
      {/* Status Dropdown */}
      <div className="w-full md:w-[50%] mt-4 mb-6">
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ✅ Fix: Scrollable Table Without Affecting Page Layout */}

      {loading ? (
        <Loader message="Loading Products..." />
      ) : (
        <div className="md:w-full w-screen overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">SubCategory</th>
                <th className="p-3 border">Brand</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentproducts.length > 0 ? (
                currentproducts.map((product) => (
                  <tr
                    key={product._id}
                    className="text-center text-sm even:bg-gray-100"
                  >
                    <td className="p-3 border">{product._id || "NA"}</td>
                    <td className="p-3 border">{product.name || "NA"}</td>
                    <td className="p-3 border">{product.category || "NA"}</td>
                    <td className="p-3 border">
                      {product.subCategory || "NA"}
                    </td>
                    <td className="p-3 border">{product.brand || "NA"}</td>
                    <td className="p-3 border capitalize">
                      {product.price || "NA"}
                    </td>
                    <td className="p-3 border flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => approveStatus(product._id)}
                        disabled={product.status === "approved"}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          product.status === "approved"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-700"
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectStatus(product._id)}
                        disabled={product.status === "rejected"}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          product.status === "rejected"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-700"
                        }`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/manageProducts/${product._id}`)
                        }
                        className="bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded-md text-white text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 border text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center my-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400"
          >
            prev
          </button>
          <div className="mx-2 font-bold">
            {"<<"}
            {currentPage}
            {">>"}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
