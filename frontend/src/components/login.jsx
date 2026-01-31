import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PremiumButton from "./PremiumBtn";
import logo from "../assets/logo.png"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);

      localStorage.setItem("token", res.data.token);

      if (res.data.user.hasOnboarded) {
        navigate("/analyze"); // Already did onboarding? Skip it!
     } else {
        navigate("/Onboarding"); // Fresh? Ask for the name
     }

    }  catch (err) {
        console.error("login error:", err); 
        setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="min-h-screen bg-white lg:bg-[#F8FAFC] flex justify-center items-center py-6 px-4 font-['Sora']">
    
    {/* Container */}
    <div className="w-full flex flex-col lg:flex-row items-stretch justify-center lg:max-w-6xl bg-white sm:rounded-[3rem] lg:rounded-[4rem] lg:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in duration-700">
      
      {/* LEFT SIDE: Laptop Only - Forced Top Alignment */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-16 pt-20 bg-[#F2F8FF]">
        <div className="w-full flex justify-center">
          <img src={logo} alt="ClearClause Logo" className="w-40 object-contain mb-10" />
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-[44px] font-bold text-black leading-tight mb-6 text-center">
            Welcome back to <br />
            <span className="text-[#0057B8]">Clear Clause.</span>
          </h2>
          <p className="text-[#4D4D4D] text-lg font-medium max-w-sm leading-relaxed text-center">
            Log in to continue analyzing your documents and identifying hidden risks in seconds.
          </p>
          
          <div className="mt-10 p-6 bg-white/60 rounded-2xl border border-white/50 max-w-xs shadow-sm">
            <p className="text-sm text-[#0057B8] font-bold uppercase tracking-wider mb-2">Pro Tip</p>
            <p className="text-sm text-[#4D4D4D]">Always check the "Limitation of Liability" section in software contracts.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form - Forced Top Alignment */}
      <div className="w-full max-w-md flex flex-col justify-start py-10 px-6 lg:px-20 lg:pt-20 lg:pb-16 lg:flex-1">
      

        <div className="w-full flex flex-col items-center lg:items-start">
          <h1 className="text-[#000000] text-center lg:text-left font-bold text-[24px] lg:text-[32px] font-['Sora'] mb-2 leading-tight">
            Log in to your account
          </h1>
          <p className="text-[#8E8E8E] text-center lg:text-left mb-10 font-['Sora'] font-normal text-lg leading-relaxed">
            Securely access your account to start scanning contracts
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* EMAIL */}
            <div className="flex flex-col items-start gap-3">
              <label className="text-[16px] font-semibold text-[#4D4D4D]">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8] border border-transparent focus:border-transparent"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col items-start gap-3">
              <label className="text-[16px] font-semibold text-[#4D4D4D]">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-14 pl-6 pr-12 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8] border border-transparent focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0057B8]"
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

            <PremiumButton 
              type="submit"
              text={loading ? "Logging in..." : "Log in"}
              disabled={loading}
            />
          </form>

          <p className="text-center lg:text-left text-sm text-[#4D4D4D] mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#D4AF37] font-bold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
    
    <style dangerouslySetInnerHTML={{ __html: `
      input::-ms-reveal, input::-ms-clear { display: none; }
    `}} />
  </div>
);
}
