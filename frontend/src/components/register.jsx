import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png"
import PremiumButton from "./PremiumBtn";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
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
    <div className="min-h-screen flex justify-center items-center py-6 px-4">
      <div className="w-full py-10 px-2 flex justify-center lg:max-w-2xl bg-white  sm:rounded-[3rem] lg:shadow-2xl animate-in fade-in duration-700 ">
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
              <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
              {/* The Eye Button */}
                <button
                  type="button" // Important: set to button so it doesn't submit the form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0057B8] transition-colors"
                >
                  {showPassword ? (
                    // Eye Off Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    // Eye Icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
              <p className="text-sm text-[#4D4D4D] font-['Sora'] mb-10 lg:mb-10">
                
                I agree to the{" "}
               <Link 
                to="/TermsAndServices" 
                className="text-[#D4AF37] font-semibold cursor-pointer hover:underline"
               >
                    Terms and Services
               </Link>
                
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

          <p className="text-center text-sm text-[#4D4D4D] mt-20 font-['Sora'] mb-6">
            We don't store your documents
          </p>
        </div>
      </div>
    </div>
  );
}