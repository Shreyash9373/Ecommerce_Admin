import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const images = [
  "https://m.media-amazon.com/images/I/71kOe866xHL._SL1500_.jpg",
  "https://source.unsplash.com/400x300/?technology",
  "https://source.unsplash.com/400x300/?travel",
  "https://source.unsplash.com/400x300/?food",
];
const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("id", id);
        let response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/product/get-product/${id}`,
          {
            withCredentials: true,
          }
        );

        console.log("res", response);
        setProduct(response.data.data.product);
        setImages(response.data.data.product.images);
        //console.log("Response", response.data.data);
        // console.log("Vendor", vendor);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchProduct();
  }, [id]);
  useEffect(() => {
    console.log("Updated Product:", product);
    console.log("Images", images);
    setSelectedImage(images[0]);
    console.log("Initial img", images[0]);
    console.log("name", product.name);
  }, [product]);
  const hiddenKeys = [
    "_id",
    "name",
    "description",
    "price",
    "images",
    "discount",
    "finalPrice",
    "addedAt",
    "createdAt",
    "updatedAt",
    "tags",
    "__v",
    "brand",
    "category",
    "subCategory",
  ];
  return (
    <div className="">
      {/* //mobile view div */}
      <div className="block lg:hidden  px-2 w-screen max-w-md mx-auto mt-4">
        <Swiper
          modules={[Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          className="rounded-lg"
        >
          {product.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-auto h-auto object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-pagination mt-4 flex justify-center gap-2"></div>
        <div className="flex flex-col items-center gap-2 ">
          <h1 className="text-2xl mt-2 font-bold">{product.name}</h1>
          <p className="text-xl">{`₹ ${product.price}`}</p>
          <p className="text-center">{product.description}</p>
        </div>
        <div className="my-4 border border-gray-500 rounded-md  ">
          <p className="text-center text-xl mb-5 mt-2 font-semibold">
            Product Details
          </p>
          <div className="flex justify-between my-2 mx-3">
            <p>Brand</p>
            <p>{product.brand}</p>
          </div>
          <div className="flex justify-between my-2 mx-3">
            <p>Category</p>
            <p>{product.category}</p>
          </div>
          <div className="flex justify-between my-2 mx-3">
            <p>SubCategory</p>
            <p>{product.subCategory}</p>
          </div>
          {Object.entries(product)
            .filter(([key]) => !hiddenKeys.includes(key))
            .map(([key, value]) =>
              typeof value === "object" ? (
                <div>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div className="flex justify-between my-2 mx-3">
                      <p key={subKey} className="">
                        {subKey}
                      </p>
                      <p> {subValue}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div key={key} className="flex justify-between my-2 mx-3">
                  <p>{key}</p>
                  <p>{value}</p>
                </div>
              )
            )}
        </div>
      </div>
      {/* Desktop View */}
      <div className="lg:flex flex-row gap-10 w-full  mx-auto p-4 hidden lg:visible">
        {/* Left Section - Thumbnails */}
        <div className="sticky top-10 flex items-center h-fit gap-3 w-[70%]">
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Center - Main Image */}
          <div className=" border border-gray-500 rounded-md shadow-md w-[80%] ">
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-full object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col gap-3 my-4 overflow-y-auto h-screen">
          <p className="text-2xl font-bold">{product.name}</p>
          <p className="text-xl font-semibold">{`Price : ₹ ${product.price}`}</p>
          <p>
            <span className="font-semibold">Description : </span>
            {` ${product.description}`}
          </p>
          <p>
            {" "}
            <span className="font-semibold">Brand : </span>
            {`${product.brand}`}
          </p>
          <p>
            {" "}
            <span className="font-semibold">Category : </span>
            {`${product.category}`}
          </p>
          <p>
            {" "}
            <span className="font-semibold">SubCategory : </span>
            {`  ${product.subCategory}`}
          </p>

          {Object.entries(product)
            .filter(([key]) => !hiddenKeys.includes(key))
            .map(([key, value]) =>
              typeof value === "object" ? (
                <div>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <p key={subKey} className="">
                      <span className="font-semibold">{`${subKey} : `}</span>
                      {`${subValue}`}
                    </p>
                  ))}
                </div>
              ) : (
                <p>
                  <span className="font-semibold">{`${key} : `}</span>
                  {`${value}`}
                </p>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
