import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage, setTotalPages } from "../redux/slices/paginationSlice";
import Loader from "../Components/Loader.jsx";
import { toast } from "react-toastify";

const ManageVendor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentPage, recordsPerPage, totalPages } = useSelector(
    (state) => state.pagination
  );
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); //  Search Query
  const [filteredVendors, setFilteredVendors] = useState([]); //  Filtered Vendors
  const [allVendors, setAllVendors] = useState([]);
  const [searchTotalPages, setSearchTotalPages] = useState(1); //  Search Total Pages
  const [loading, setLoading] = useState(false);

  //Pagination logic
  // totalPages = Math.ceil(vendors.length / recordsPerPage);
  dispatch(setTotalPages(Math.ceil(vendors.length / recordsPerPage)));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentVendors = filteredVendors.slice(
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
    navigate(`/manageVendor?status=${selectedValue}`);
    // onChange(selectedValue); // Notify parent component (if needed)
  };

  // useeffect to set default dropdown value based on query param
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const queryStatus = params.get("status");

  // Update default dropdown if query param exists
  //   if (queryStatus) {
  //     setStatus(queryStatus);
  //   }
  // }, [location.search]);
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const queryStatus = params.get("status") || "pending";
        if (queryStatus !== status) setStatus(queryStatus); // keep UI dropdown synced
        let endpoint = "";
        if (queryStatus === "pending") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getPendingVendors`;
        } else if (queryStatus === "approved") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getApprovedVendors`;
        } else {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getRejectedVendors`;
        }

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });
        console.log("Response", response.data.data);
        setVendors(response.data.data);
        setFilteredVendors(response.data.data);
        console.log("PendingVendors", vendors);
      } catch (error) {
        console.log("Error", error);
      }
    };

    // const fetchVendor = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getSearchVendor`,
    //       {
    //         params: {
    //           search: searchQuery, // 🔍 Send search query
    //           status: status,
    //           page: currentPage, // 📌 Pagination
    //           limit: recordsPerPage,
    //         },
    //         withCredentials: true,
    //       }
    //     );

    //     setVendors(response.data.vendors);
    //     setTotalPages(response.data.totalPages);
    //   } catch (error) {
    //     console.error("Error fetching vendors:", error);
    //   }
    // };
    fetchVendor();
  }, [location.search, dispatch, recordsPerPage, searchQuery]);
  // 🔍 Search Functionality
  useEffect(() => {
    var filtered;
    // if (searchQuery === "") {
    //   filtered = vendors.filter(
    //     (vendor) =>
    //       vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //       vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //       vendor.phone.includes(searchQuery)
    //   );
    // } else if (searchQuery != "") {
    //   filtered = allVendors.filter(
    //     (vendor) =>
    //       vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //       vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //       vendor.phone.includes(searchQuery)
    //   );
    // }

    const searchVendor = async () => {
      if (searchQuery === "") {
        filtered = vendors.filter(
          (vendor) =>
            vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.phone.includes(searchQuery)
        );
        setFilteredVendors(filtered);
      } else if (searchQuery !== "") {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getSearchVendor`,
            {
              params: {
                search: searchQuery,
                page: currentPage,
                limit: recordsPerPage,
              },
              withCredentials: true,
            }
          );
          console.log("SearchResponse", response.data.vendors);
          setSearchTotalPages(response.data.totalPages);
          setFilteredVendors(response.data.vendors || []);
        } catch (error) {
          console.error("Search Fetch Error:", error);
          setFilteredVendors([]);
        }
      }
    };
    searchVendor();
  }, [searchQuery, currentPage]);
  // useEffect(() => {
  //   try {
  //     const fetchAllVendors = async () => {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getAllVendors`,
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       console.log("AllVendorsResponse", response.data.data);
  //       setAllVendors(response.data.data);
  //     };
  //     fetchAllVendors();
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // }, []);

  const approveStatus = async (vendorId) => {
    try {
      setLoading(true);
      console.log("vid", vendorId);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/approveVendor/${vendorId}`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/manageVendor?status=approved");
      // setVendors((prevVendors) =>
      //   prevVendors.map((vendor) =>
      //     vendor._id === vendorId ? { ...vendor, status: "approved" } : vendor
      //   )
      // );
      toast.success("Vendor Approved Successfully!");
      console.log("ApprovedResponse", response.data);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Error approving vendor!");
    } finally {
      setLoading(false);
    }
  };

  const rejectStatus = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/rejectVendor/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/manageVendor?status=rejected");
      // setVendors((prevVendors) =>
      //   prevVendors.map((vendor) =>
      //     vendor._id === vendorId ? { ...vendor, status: "rejected" } : vendor
      //   )
      // );
      toast.success("Vendor Rejected Successfully!");
      console.log("RejectedResponse", response.data);
    } catch (error) {
      console.log("Error:", error);
      toast.error("Error rejecting vendor!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-4 px-1 bg-white shadow-lg rounded-lg ">
      <h1 className="text-3xl font-semibold mb-2 text-gray-800">Vendors</h1>
      <p className="text-gray-600">List of Vendors</p>
      {/*  Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
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
        <Loader message="Updating status..." />
      ) : (
        <div className="md:w-full w-screen overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Store Name</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentVendors.length > 0 ? (
                currentVendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="text-center text-sm even:bg-gray-100"
                  >
                    <td className="p-3 border">{vendor._id || "NA"}</td>
                    <td className="p-3 border">{vendor.name || "NA"}</td>
                    <td className="p-3 border">{vendor.email || "NA"}</td>
                    <td className="p-3 border">{vendor.phone || "NA"}</td>
                    <td className="p-3 border">{vendor.storeName || "NA"}</td>
                    <td className="p-3 border capitalize">
                      {vendor.status || "NA"}
                    </td>
                    <td className="p-3 border flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => approveStatus(vendor._id)}
                        disabled={vendor.status === "approved"}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          vendor.status === "approved"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-700"
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectStatus(vendor._id)}
                        disabled={vendor.status === "rejected"}
                        className={`px-3 py-1 rounded-md text-white text-sm ${
                          vendor.status === "rejected"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-700"
                        }`}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => navigate(`/manageVendor/${vendor._id}`)}
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
                    No vendors available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {(totalPages > 1 || searchTotalPages > 1) && (
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

export default ManageVendor;
