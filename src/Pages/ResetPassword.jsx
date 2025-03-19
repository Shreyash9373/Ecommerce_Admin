import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/reset-password`,
        {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );

      setMessage(res.data.message || "Password changed successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[98%] bg-gradient-to-br from-blue-300 to-purple-200 h-screen">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Enter Your Email
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-3 rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Set New Password
            </h3>
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: 6,
                  })}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Enter new password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
