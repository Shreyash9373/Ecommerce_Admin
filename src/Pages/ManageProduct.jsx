import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage, setTotalPages } from "../redux/slices/paginationSlice";

const ManageProduct = () => {
  const dispatch = useDispatch();
  const { currentPage, recordsPerPage, totalPages } = useSelector(
    (state) => state.pagination
  );
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [products, setproducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); //  Search Query
  const [filteredProducts, setFilteredProducts] = useState([]); //  Filtered Vendors

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
    setStatus(selectedValue);
    console.log(status);
    // onChange(selectedValue); // Notify parent component (if needed)
  };
  useEffect(() => {
    const fetchproduct = async () => {
      try {
        let endpoint = "";
        if (status === "pending") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getPendingProducts`;
        } else if (status === "approved") {
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
        console.log("Pendingproducts", products);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchproduct();
  }, [dispatch, recordsPerPage, status]);

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
      console.log("pid", productId);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/approveProduct/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setStatus("approved");
      console.log("ApprovedResponse", response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const rejectStatus = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/rejectProduct/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setStatus("rejected");
      console.log("RejectedResponse", response.data);
    } catch (error) {
      console.log("Error:", error);
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
                  <td className="p-3 border">{product.subCategory || "NA"}</td>
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
                      onClick={() => navigate(`/manageProducts/${product._id}`)}
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
