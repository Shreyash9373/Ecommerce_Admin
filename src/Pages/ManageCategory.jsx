import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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

  // Handle Add or Update Category
  const onSubmit = (data) => {
    console.log("Form Data", data);
    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingId ? { ...cat, ...data } : cat))
      );
      toast.success("Category updated successfully!");
      setEditingId(null);
    } else {
      setCategories([...categories, { id: Date.now(), ...data }]);
      toast.success("Category added successfully!");
    }
    reset();
  };

  // Edit Category
  const handleEdit = (category) => {
    setEditingId(category.id);
    setValue("name", category.name);
    setValue("slug", category.slug);
    setValue("parentCategory", category.parentCategory);
    setValue("description", category.description);
    setValue("image", category.image);
    setValue("status", category.status);
  };

  // Delete Category
  const handleDelete = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    toast.success("Category deleted successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        {/* Category Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
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

          <div>
            <label className="text-sm font-semibold">Slug</label>
            <input
              type="text"
              {...register("slug")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Parent Category</label>
            <input
              type="text"
              {...register("parentCategory")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Description</label>
            <textarea
              {...register("description")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => console.log(e.target.files[0])}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
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
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Manage Categories
        </h2>

        {categories.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Slug</th>
                <th className="p-2 border">Parent</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="text-center">
                  <td className="p-2 border">{cat.name}</td>
                  <td className="p-2 border">{cat.slug}</td>
                  <td className="p-2 border">{cat.parentCategory || "-"}</td>
                  <td
                    className={`p-2 border ${
                      cat.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {cat.status}
                  </td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(cat)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default ManageCategory;
