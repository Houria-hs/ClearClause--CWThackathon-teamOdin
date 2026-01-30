import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"
import PremiumButton from "./PremiumBtn";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      setError("You must agree to the Terms and Services.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", res.data.token); 
      navigate("/login");
    } catch (err) {
        console.error("Register error:", err); 
        setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-10 px-4">
      <div className="w-full  flex justify-center ">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="ClearCause Logo" className=" object-contain" />
          </div>

          <p
           className="text-[#4D4D4D] font-['Sora']  mb-8 bold-normal leading-[30px]  text-center text-[20px">
            Securely create your account to start scanning contracts
          </p>

          {error && (
            <div className="mb-6 rounded-lg font-['Sora']  bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FULL NAME */}
            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-['Sora']  font-medium text-[#4D4D4D]">Full name</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your full name"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-['Sora']  font-medium text-[#4D4D4D]">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-['Sora']  font-medium text-[#4D4D4D]">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2 mb-4">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="text-sm text-[#4D4D4D] font-['Sora'] mb-20 lg:mb-10">
                I agree to the{" "}
                <span className="text-[#D4AF37] cursor-pointer hover:underline ">
                  Terms and Services
                </span>
              </p>
            </div>

            {/* Button */}

            <PremiumButton 
                type="submit"
                text={loading ? "Creating account..." : "Register"}
                disabled={loading}
                // onClick={() => navigate("/register")}
            />
          </form>

          {/* Sign in */}
          <p className="text-center text-sm text-[#4D4D4D] mt-8 font-['Sora']  ">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#D4AF37] cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>

          <p className="text-center text-sm text-[#4D4D4D] mt-20 font-['Sora'] ">
            We don't store your documents
          </p>
        </div>
      </div>
    </div>
  );
}