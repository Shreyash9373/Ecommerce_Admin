// src/components/Loader.jsx
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#1e40af"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <p className="mt-2 text-blue-600 font-semibold">{message}</p>
    </div>
  );
};

export default Loader;
