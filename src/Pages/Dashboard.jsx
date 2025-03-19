import React, { useState } from "react";
import { useEffect } from "react";
import sales from "../assets/sales.png";
import order from "../assets/order.png";
import income from "../assets/income.png";
import visitor from "../assets/visitor.png";
import axios from "axios";

const Dashboard = () => {
  const [product, setProduct] = useState([]);
  const [vendor, setVendor] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getApprovedProducts`,
          {
            withCredentials: true,
          }
        );
        const vendorResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getApprovedVendors`,
          {
            withCredentials: true,
          }
        );
        console.log("ProductResponse", productResponse.data);
        if (productResponse.data) {
          setProduct(productResponse.data.data);
        }
        if (vendorResponse.data) {
          setVendor(vendorResponse.data.data);
        }
        console.log("VendorResponse", vendorResponse.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    console.log("ProductData", product);
    console.log("VendorData", vendor);
  }, [product, vendor]);

  return (
    <div>
      {/* dashboard stats */}
      <div className="flex flex-col lg:flex-row lg:justify-between mx-4 my-4">
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md">
          <img src={sales} className="w-16 h-14"></img>
          <div>
            <p className="text-xl font-bold">Total Sales</p>
            <p className="font-semibold">Rs 5000</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md">
          <img src={income} className="w-16 h-14"></img>
          <div>
            <p className="text-xl font-bold">Total Income</p>
            <p className="font-semibold">Rs 2000</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md">
          <img src={order} className="w-16 h-14"></img>
          <div>
            <p className="text-xl font-bold">Orders Paid</p>
            <p className="font-semibold">Rs 5000</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md">
          <img src={visitor} className="w-16 h-14"></img>
          <div>
            <p className="text-xl font-bold">Total Visitor</p>
            <p className="font-semibold">1000</p>
          </div>
        </div>
      </div>

      {/* Top Products section */}
      <div className="flex flex-col lg:flex-row">
        <div className="w-[90%] border border-gray-400 rounded-md m-auto lg:w-[60%] lg:ml-3 p-2">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Top products</p>
            <button>View all</button>
          </div>
          {product.slice(0, 3).map((prod, index) => (
            <div key={index} className="flex items-center my-6">
              {/* <p >{prod}</p> */}
              <img
                src={prod.images[0]}
                className="w-12 h-12 border border-gray-300 rounded-lg p-1 bg-gray-300 ml-2 "
                alt="productimg"
              />
              <div className="flex flex-col mx-8  ">
                <p className="text-base/6">{prod.name}</p>
                <p className="text-base/6">{`${prod.stock} Items`}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top Vendor Section */}
        <div className="w-[90%] border border-gray-400 rounded-md m-auto p-2 my-4 lg:w-[60%] lg:ml-2 lg:mr-2 ">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Top Vendors</p>
            <button>View all</button>
          </div>
          {vendor.slice(0, 3).map((vend, index) => (
            <div key={index} className="flex items-center my-6">
              {/* <p >{prod}</p> */}
              <img
                src={vend.avatar}
                className="w-12 h-12 border border-gray-300 rounded-lg p-1 bg-gray-300 ml-2 "
                alt="productimg"
              />
              <div className="flex flex-col mx-8  ">
                <p className="text-base/6">{vend.name}</p>
                <p className="text-base/6">{`${vend.totalOrders} Purchases`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
