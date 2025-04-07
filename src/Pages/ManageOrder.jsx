import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ManageOrder = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { register, handleSubmit } = useForm();
  const [activeTab, setActiveTab] = useState("Processing");

  const fetchOrders = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/order/get-OrderStatus`,
        {
          params: { status },
          withCredentials: true,
        }
      );
      setOrders(response.data.data.orders);
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  // if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="w-full p-3">
      <h2 className="text-3xl font-semibold mb-6 text-start">Manage Orders</h2>

      {/* Tabs */}
      <div className="w-full max-w-2xl flex my-4 p-2 py-1 justify-between items-center bg-gray-200 rounded-full mx-auto text-xs">
        {[
          "Processing",
          "Pending",
          "Shipped",
          "Delivered",
          "Completed",
          "Cancelled",
        ].map((tab) => (
          <button
            key={tab}
            className={`flex-1 min-w-[80px] py-2 px-2 rounded-full transition-all text-[10px] sm:text-sm ${
              activeTab === tab
                ? "bg-blue-400 font-bold text-slate-900  shadow-md"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      {orders && orders.length === 0 ? (
        <div>
          <h1>No Orders Available</h1>
        </div>
      ) : (
        orders?.map((order) => (
          <div
            key={order._id}
            className="mb-6 m-6 p-4  border  border-gray-300 rounded-lg shadow-md bg-white"
          >
            <p className="font-semibold text-lg mb-2">Order ID: {order._id}</p>

            {/* Product Details and Payment Details  */}
            <div className=" w-full flex flex-col justify-around">
              {/* Product Details */}
              <div className="mb-4 p-3 bg-gray-200 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Product Details:</h3>
                {order.items.map((item) => (
                  <div key={item._id} className="text-gray-800">
                    <p>
                      <span className="font-medium">Product Name: </span>{" "}
                      {item.productSnapshot.name}
                    </p>
                    <p>
                      <span className="font-medium">Product Price: </span>{" "}
                      {item.productSnapshot.price}
                    </p>
                    <p>
                      <span className="font-medium">Product Quantity: </span>{" "}
                      {item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="mb-4 p-3 bg-gray-200 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Payment Details:</h3>
                <p>
                  <span className="font-medium">Payment Amount: </span>{" "}
                  {order.totalAmount}
                </p>
                <p>
                  <span className="font-medium">Payment Method: </span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Payment Status: </span>{" "}
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4 p-3 bg-gray-200 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Shipping Address:</h3>
              <p>
                <span className="font-medium">Street:</span>{" "}
                {order.shippingAddress.street}
              </p>
              <p>
                <span className="font-medium">City:</span>{" "}
                {order.shippingAddress.city}
              </p>
              <p>
                <span className="font-medium">State:</span>{" "}
                {order.shippingAddress.state}
              </p>
              <p>
                <span className="font-medium">ZIP Code:</span>{" "}
                {order.shippingAddress.zip}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Change Status */}
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Current Status:</span>{" "}
              {order.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrder;
