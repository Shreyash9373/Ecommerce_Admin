import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sales from "../assets/sales.png";
import white_sales from "../assets/white_sales.png";

import order from "../assets/order.png";
import white_order from "../assets/white_order.png";

import income from "../assets/income.png";
import white_income from "../assets/white_income.png";

import visitor from "../assets/visitor.png";
import white_visitor from "../assets/white_visitor.png";

import axios from "axios";
import SalesIncomeChart from "../Components/SalesIncomeChart";
import { useDispatch, useSelector } from "react-redux";
// import { setDarkMode } from "../redux/slices/adminSlice";
import useDarkMode from "../hooks/useDarkMode";

const Dashboard = () => {
  const [product, setProduct] = useState([]);
  const [vendor, setVendor] = useState([]);
  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem("theme") === "dark" ? true : false
  // );
  // const [theme, setTheme] = useDarkMode();
  const theme = useSelector((state) => state.admin.theme);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalIncome: 0,
    OrdersPaid: 0,
    totalVisitor: 5,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dashboardstatsres = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getDashboardData`,
          {
            withCredentials: true,
          }
        );
        setStats({
          totalSales: dashboardstatsres.data.totalSales,
          totalIncome: dashboardstatsres.data.totalIncome,
          OrdersPaid: dashboardstatsres.data.totalPaidOrders,
        });

        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getTopSellingProducts?range=month`,
          {
            withCredentials: true,
          }
        );

        if (productResponse.data?.topProducts) {
          setProduct(productResponse.data.topProducts);
        }
        const vendorResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getTopVendors?range=month`,
          {
            withCredentials: true,
          }
        );
        console.log("vendorResponse", vendorResponse.data);

        if (vendorResponse.data?.topVendors) {
          setVendor(vendorResponse.data.topVendors);
        }
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
      <div className="flex flex-col lg:flex-row lg:justify-between  mx-4 my-4">
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md dark:bg-black">
          {theme === "dark" ? (
            <img src={white_sales} className="w-16 h-14 "></img>
          ) : (
            <img src={sales} className="w-16 h-14 "></img>
          )}
          <div>
            <p className="text-xl font-bold">Total Sales</p>
            <p className="font-semibold">{stats.totalSales}</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md dark:bg-black">
          {theme === "dark" ? (
            <img src={white_income} className="w-16 h-14"></img>
          ) : (
            <img src={income} className="w-16 h-14"></img>
          )}
          <div>
            <p className="text-xl font-bold">Total Income</p>
            <p className="font-semibold">Rs {stats.totalIncome}</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md dark:bg-black">
          {theme === "dark" ? (
            <img src={white_order} className="w-16 h-14"></img>
          ) : (
            <img src={order} className="w-16 h-14"></img>
          )}
          <div>
            <p className="text-xl font-bold">Orders Paid</p>
            <p className="font-semibold">{stats.OrdersPaid}</p>
          </div>
        </div>
        <div className="flex my-2 border border-gray-400 shadow-md p-4 rounded-md dark:bg-black">
          {theme === "dark" ? (
            <img src={white_visitor} className="w-16 h-14"></img>
          ) : (
            <img src={visitor} className="w-16 h-14"></img>
          )}
          <div>
            <p className="text-xl font-bold">Total Visitor</p>
            <p className="font-semibold">
              {!stats.totalVisitor ? 5 : stats.totalVisitor}
            </p>
          </div>
        </div>
      </div>

      {/* Top Products section */}
      <div className="flex flex-col lg:flex-row">
        <div className="w-[90%] border border-gray-400 rounded-md m-auto lg:w-[60%] lg:ml-3 p-2 dark:bg-black">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Top products</p>
            <button>View all</button>
          </div>
          {Array.isArray(product) &&
            product.slice(0, 3).map((prod, index) => (
              <div key={index} className="flex items-center my-6">
                {/* <p >{prod}</p> */}
                <img
                  src={prod.image}
                  className="w-12 h-12 border border-gray-300 rounded-lg p-1 bg-gray-300 ml-2 "
                  alt="productimg"
                />
                <div
                  onClick={() => navigate(`/manageProducts/${prod.productId}`)}
                  className="flex flex-col mx-8 cursor-pointer "
                >
                  <p className="text-base/6">{prod.name}</p>
                  <p className="text-base/6">{`${prod.totalSold} quantities Sold`}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Top Vendor Section */}
        <div className="w-[90%] border border-gray-400 rounded-md m-auto p-2 my-4 lg:w-[60%] lg:ml-2 lg:mr-2 dark:bg-black ">
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
              <div
                onClick={() => navigate(`/manageVendor/${vend.vendorId}`)}
                className="flex flex-col mx-8 cursor-pointer  "
              >
                <p className="text-base/6">{vend.name}</p>
                <p className="text-base/6">{`${vend.totalSold} Products Sold`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SalesIncomeChart />
    </div>
  );
};

export default Dashboard;
