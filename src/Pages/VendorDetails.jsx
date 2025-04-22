import React from "react";
import { useState, useEffect } from "react";
import profilepic from "../assets/profilepic.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";

const VendorDetails = () => {
  const [vendor, setVendor] = useState({});
  const [documents, setDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        console.log("id", id);
        let response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/vendor/get-vendorById/${id}`,
          {
            withCredentials: true,
          }
        );
        setVendor(response.data.data.vendor);
        //console.log("Response", response.data.data);
        // console.log("Vendor", vendor);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchVendor();
  }, [id]);

  useEffect(() => {
    setDocuments(vendor.verificationDocuments);
    console.log("Updated Vendor:", vendor);
    console.log("name", vendor.name);
    console.log("Documents", documents);
  }, [vendor]);

  // Function to handle viewing PDF
  const handleViewPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  // Function to handle downloading PDF
  const handleDownloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop(); // Extracts file name from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="px-2">
      <h1 className="text-green-900 font-bold mt-2 dark:text-white">
        My Profile
      </h1>
      <div className="flex my-4 border border-gray-300 shadow-md rounded-md py-2 dark:bg-black dark:text-white">
        <img
          className="w-24 h-24 rounded-full mx-2"
          src={vendor.avatar}
          alt="Profile Image"
        />
        <div className="flex flex-col justify-center">
          <h2>{vendor.name}</h2>
          <p>Vendor</p>
        </div>
      </div>

      <div className=" my-4 border border-gray-300 shadow-md rounded-md py-2 dark:bg-black ">
        <h2 className="mx-2 text-green-900 font-bold dark:text-white">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-2 my-3 ">
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">Name</p>
            <p>{vendor.name}</p>
          </div>
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">Email</p>
            <p>{vendor.email}</p>
          </div>
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">Phone</p>
            <p>{vendor.phone}</p>
          </div>
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">Store Name</p>
            <p>{vendor.storeName}</p>
          </div>
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">BusinessType</p>
            <p>{vendor.businessType}</p>
          </div>
          <div className="flex justify-between md:flex-col my-2">
            <p className="text-gray-600 dark:text-white">Status</p>
            <p>{vendor.status}</p>
          </div>
        </div>
      </div>
      <div className="my-4 border border-gray-300 shadow-md rounded-md py-2 p-4 dark:bg-black">
        <h2 className="text-green-900 font-bold mx-2 dark:text-white">
          Uploaded Documents
        </h2>
        {documents?.length > 0 ? (
          <div className="space-y-2">
            {documents.map((document, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
              >
                <p className="break-all text-sm">{document.split("/").pop()}</p>{" "}
                {/* Display PDF Name */}
                <div className="flex gap-2">
                  {/* View Button */}
                  <button
                    onClick={() => handleViewPdf(document)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                  >
                    View
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadPdf(document)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No Documents Uploaded</p>
        )}

        {/* Modal for Viewing PDF */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-[80%] h-[80%] flex flex-col">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">View Document</h2>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="text-red-500 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Embed PDF in Dialog */}
              <iframe
                src={selectedPdf}
                className="w-full h-full mt-2"
                title="PDF Viewer"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;
