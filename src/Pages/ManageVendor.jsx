import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageVendor = () => {
  const [status, setStatus] = useState("pending");
  const [vendors, setVendors] = useState([]);
  const handleStatusChange = (event) => {
    const selectedValue = event.target.value;
    setStatus(selectedValue);
    console.log(status);
    // onChange(selectedValue); // Notify parent component (if needed)
  };
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        let endpoint = "";
        if (status === "pending") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getPendingVendors`;
        } else if (status === "approved") {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getApprovedVendors`;
        } else {
          endpoint = `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getRejectedVendors`;
        }

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });
        console.log("Response", response.data.data);
        setVendors(response.data.data);
        console.log("PendingVendors", vendors);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchVendor();
  }, [status]);

  return (
    <div className="flex flex-col m-4">
      <h1 className="text-4xl mb-2">Vendors</h1>
      <p>List of Vendors</p>
      <div className="w-[50%] mt-2">
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
      <table className="w-full border-collapse border border-gray-300 min-w-[800px] overflow-x-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
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
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <tr key={vendor._id} className="text-center">
                <td>{vendor._id}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.storeName}</td>
                <td>{vendor.status}</td>
                <td>
                  <button>Approve</button>
                  <button>Reject</button>
                  <button>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {" "}
              <td colSpan="6" className="p-3 border text-center text-gray-500">
                No vendors available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageVendor;
