import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PremiumButton from "../components/PremiumBtn";

export default function VerifyEmailPending() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-10 font-['Sora']">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-10 md:p-14 text-center">

        {/* Logo */}
        <img
          src={logo}
          alt="ClearClause"
          className="w-32 mx-auto mb-10"
        />

        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <span className="text-5xl">📧</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-[#111827] mb-4">
          Check your inbox
        </h1>

        <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
          We've sent a verification link to the email address below.
          Verify your account to start analyzing contracts securely.
        </p>

        {/* Email */}
        <div className="bg-[#F5F9FF] border border-[#D9EAFE] rounded-2xl px-6 py-5 mb-8">
          <p className="text-sm uppercase tracking-wider text-[#0057B8] font-bold mb-2">
            Verification email sent to
          </p>

          <p className="text-lg font-semibold text-[#111827] break-all">
            {state?.email || "No email found"}
          </p>
        </div>

        {/* Info */}
        <div className="space-y-3 text-[#6B7280] text-sm mb-10">
          <p>✓ Click the verification link in your email.</p>
          <p>✓ The link activates your ClearClause account.</p>
          <p>✓ After verification you can log in immediately.</p>
        </div>

        <PremiumButton
          text="Back to Login"
          onClick={() => navigate("/login")}
        />

        <button
          onClick={() => navigate("/register")}
          className="mt-5 text-[#D4AF37] font-semibold hover:underline"
        >
          Register with another email
        </button>

        <p className="mt-10 text-xs text-[#9CA3AF]">
          Can't find the email? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
}