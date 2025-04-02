import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie"; // Import for handling cookies

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // "email", "otp", "reset"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = Cookies.get("resetToken"); // Check if reset token is present
    if (token) {
      setStep("reset"); // Show reset password form
    }
  }, []);

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/sendOtp`,
        { email }
      );
      setStep("otp"); // Move to OTP verification step
      setMessage(res.data.message || "OTP sent successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/verifyOtp`,
        { email, otp: data.otp }
      );

      Cookies.set("resetToken", res.data.resetToken, { expires: 0.01 }); // Store resetToken in cookies for 15 minutes
      setStep("reset"); // Move to reset password step
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/reset-password`,
        {
          email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          // resetToken: Cookies.get("resetToken"),
        }
      );

      setMessage(res.data.message || "Password changed successfully!");
      Cookies.remove("resetToken"); // Remove reset token after password reset
      setStep("email"); // Reset back to email input
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-purple-200 mt-[-4rem]">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {step === "reset" ? "Reset Password" : "Forgot Password"}
        </h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <div className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-6">
            <input
              type="text"
              {...register("otp", { required: "OTP is required" })}
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            />
            {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: 6,
                })}
                placeholder="New password"
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Confirm password"
                className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
