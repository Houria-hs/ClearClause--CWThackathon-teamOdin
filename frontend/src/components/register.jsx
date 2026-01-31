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
    <div className="min-h-screen bg-white lg:bg-[#F8FAFC] flex justify-center items-center py-6 px-4 font-['Sora']">
      
      {/* Container: Max-2xl on mobile (stays clean), Max-6xl on laptop (splits) */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:max-w-6xl bg-white sm:rounded-[3rem] lg:rounded-[4rem] lg:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in duration-700">
        
        {/* LEFT SIDE: Laptop Only Content */}
        <div className="hidden lg:flex flex-1 flex-col justify-start p-20 bg-[#F2F8FF] self-stretch">
          <div className="flex justify-center items-center">
            <img src={logo} alt="ClearClause Logo" className="w-40 object-contain mb-12" />

          </div>
          <h2 className="text-[44px] font-bold text-black leading-tight mb-6">
            Join thousands of users <span className="text-[#0057B8]">signing with confidence.</span>
          </h2>
          <ul className="space-y-6 mt-6">
            {[
              "Instant unfair clause detection",
              "Real-time ambiguous term flagging",
              "Zero document retention policy",
              "AI-powered legal insights"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-[#4D4D4D] font-medium">
                <div className="w-6 h-6 rounded-full bg-[#0057B8] flex items-center justify-center text-white text-[12px]">✓</div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE: The Register Form (Your Original Mobile UI) */}
        <div className="w-full max-w-md py-10 px-6 lg:px-20 lg:flex-1">
          {/* Mobile Logo: Hidden on Laptop */}
          <div className="flex justify-center mb-6 lg:hidden">
            <img src={logo} alt="ClearCause Logo" className="object-contain" />
          </div>

          <p className="text-[#4D4D4D] mb-8 leading-[30px] text-center text-[20px] lg:text-left lg:text-[20px] lg:font-bold">
            Securely create your account to start scanning contracts
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-medium text-[#4D4D4D]">Full name</label>
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

            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-medium text-[#4D4D4D]">Email address</label>
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

            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-medium text-[#4D4D4D]">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-14 pl-6 pr-12 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0057B8] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 accent-[#0057B8]"
              />
              <p className="text-sm text-[#4D4D4D]">
                I agree to the{" "}
                <Link to="/TermsAndServices" className="text-[#D4AF37] font-semibold hover:underline">
                  Terms of Service
                </Link>
              </p>
            </div>

            <PremiumButton 
              type="submit"
              text={loading ? "Creating account..." : "Register"}
              disabled={loading}
            />
          </form>

          <p className="text-center text-sm text-[#4D4D4D] mt-8 lg:text-left">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-[#D4AF37] font-bold cursor-pointer hover:underline">
              Log in
            </span>
          </p>

          <p className="text-center text-sm text-[#9D9A9A] mt-16 lg:text-left">
            🔒 We don't store your documents
          </p>
        </div>
      </div>

      {/* Edge/IE Eye Icon Remover */}
      <style dangerouslySetInnerHTML={{ __html: `
        input::-ms-reveal, input::-ms-clear { display: none; }
      `}} />
    </div>
  );
}