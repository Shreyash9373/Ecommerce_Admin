import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage, setTotalPages } from "../redux/slices/paginationSlice";

const ManageCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [catreload, setCatReload] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState([]);
  //Pagination Logic
  const dispatch = useDispatch();
  const { currentPage, recordsPerPage, totalPages } = useSelector(
    (state) => state.pagination
  );

  const indexofLastRecord = currentPage * recordsPerPage;
  const indexofFirstRecord = indexofLastRecord - recordsPerPage;
  const currentCategory = filteredCategory.slice(
    indexofFirstRecord,
    indexofLastRecord
  );
  dispatch(setTotalPages(Math.ceil(categories.length / recordsPerPage)));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  // Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/getAllCategories`,
          { withCredentials: true }
        );
        setCategories(response.data.data);
        setFilteredCategory(response.data.data);
        console.log("setcaategories", response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [catreload]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    console.log(selectedImage); // Store the selected file
  };

  // Handle Add or Update Category
  const onSubmit = async (data) => {
    try {
      console.log("form data", data);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("parentCategory", data.parentCategory);
      formData.append("description", data.description);
      formData.append("status", data.status);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      console.log("Data", formData);
      let response;
      if (editingId) {
        // Update Category
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/updateCategory/${editingId}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // setCategories((prev) =>
        //   prev.map((cat) => (cat._id === editingId ? response.data : cat))
        // );
        setCatReload((prev) => !prev);

        toast.success("Category updated successfully!");
      } else {
        // Add Category
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/addCategory`,
          formData,
          {
            withCredentials: true,
            // headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Response data", response.data);

        setCategories((prevCat) => [...prevCat, response.data]);
        setCatReload((prev) => !prev);

        toast.success("Category added successfully!");
      }

      reset();
      setEditingId(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Failed to add/update category");
    }
  };

  // Edit Category
  const handleEdit = (category) => {
    setEditingId(category._id);
    setValue("name", category.name);
    setValue("slug", category.slug);
    setValue("parentCategory", category.parentCategory?._id || "");
    setValue("description", category.description);
    setValue("status", category.status);
    setSelectedImage(null); // Reset selected image
  };

  // Delete Category
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/deleteCategory/${id}`,
        { withCredentials: true }
      );
      if (response.data) {
        setCatReload((prev) => !prev);
        console.log("Delete response", response);
        setCategories(categories.filter((cat) => cat._id !== id));
        toast.success("Category deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="px-3 py-4 bg-gray-100 min-h-screen max-w-full z-[999]">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        {/* Category Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 "
          encType="multipart/form-data"
        >
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Category Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Slug</label>
            <input
              type="text"
              {...register("slug")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Parent Category</label>
            <select
              {...register("parentCategory")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">None</option>{" "}
              {/* ✅ Default option for main category */}
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              {...register("description")}
              className="w-full h-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-semibold">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
            >
              <FaPlus /> {editingId ? "Update" : "Add"} Category
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => {
                  reset();
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-full overflow-x-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Manage Categories
        </h2>

        {(currentCategory || []).length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">CategoryName</th>
                <th className="p-2 border">ParentCategory</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCategory.map((cat) => (
                <tr key={cat._id}>
                  <td className="p-2 border">{cat.name}</td>
                  <td className="p-2 border">
                    {cat.parentCategory == null
                      ? cat.name
                      : cat.parentCategory.name}
                  </td>
                  {/* {console.log("categoreis", cat.name, cat.slug)} */}
                  <td className="p-2 border flex gap-2">
                    <button onClick={() => handleEdit(cat)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(cat._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories available</p>
        )}
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

export default ManageCategory;
