import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PremiumButton from "../components/PremiumBtn";

export default function VerifyEmailSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-10 font-['Sora']">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-10 md:p-14 text-center">

        {/* Logo */}
        <img
          src={logo}
          alt="ClearClause"
          className="w-32 mx-auto mb-10"
        />

        {/* Success Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-[#111827] mb-4">
          Email Verified Successfully
        </h1>

        <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
          Your account has been verified successfully.
          You can now securely sign in and start analyzing contracts with
          AI-powered legal insights.
        </p>

        {/* Progress */}
        <div className="bg-[#F5F9FF] border border-[#D9EAFE] rounded-2xl px-6 py-6 mb-10">
          <div className="flex flex-col gap-4 text-left">

            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="font-medium text-[#111827]">
                Account created
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </span>
              <span className="font-medium text-[#111827]">
                Email verified
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0057B8] text-white flex items-center justify-center text-sm font-bold">
                →
              </span>
              <span className="font-medium text-[#0057B8]">
                Redirecting to login...
              </span>
            </div>

          </div>
        </div>

        <PremiumButton
          text="Go to Login"
          onClick={() => navigate("/login")}
        />

        <p className="mt-8 text-sm text-[#9CA3AF]">
          You'll be redirected automatically in a few seconds.
        </p>

      </div>
    </div>
  );
}
