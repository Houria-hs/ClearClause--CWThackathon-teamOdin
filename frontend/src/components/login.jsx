import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PremiumButton from "./PremiumBtn";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      navigate("/Onboarding"); 
    }  catch (err) {
        console.error("login error:", err); 
        setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex pt-10">
      <div className="w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md ">

          <p className="text-[#000000] text-start mb-2 text-center font-medium text-[20px] font-['Sora']">
            Log in to your account
          </p>
          <p
           className="text-[#4D4D4D] text-[#8E8E8E] text-start mb-8 font-['Sora']  mb-8 font-normal text-center text-lg">
            Securely create your account to start scanning contracts
          </p>


          {error && (
            <div className="mb-6 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div className="flex flex-col items-start gap-[12px]">
              <label className="text-[16px] font-medium text-[#4D4D4D] font-['Sora']">Email address</label>
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
              <label className="text-[16px] font-medium text-[#4D4D4D] font-['Sora']">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-14 px-6 rounded-xl bg-[#F9F9F9] text-[#4D4D4D] placeholder-[#9D9A9A] focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="text-sm text-[#4D4D4D] font-['Sora'] mb-10">
                Remember me
              </p>
            </div>


             <PremiumButton 
                type="submit"
                text={loading ? "Logging in..." : "Log in"}
                disabled={loading}
                // onClick={() => navigate("/register")}
            />
          
          </form>

          {/* Sign up */}
          <p className="text-center font-['Sora'] text-sm text-[#4D4D4D] mt-8">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#D4AF37] cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
