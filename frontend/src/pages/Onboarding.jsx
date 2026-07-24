import React, { useState } from "react";
import PremiumButton from "../components/PremiumBtn";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../config/api";

export default function OnboardingName({ setUser }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Controls the popup

const handleProceed = () => {
  if (name.trim()) {
    // Spread prev state so we don't lose the user's email/id
    setUser(prev => ({ ...prev, username: name.trim() }));
    setShowModal(true);
    localStorage.setItem("userName", name.trim());
  }
};

const handleFinalAgreement = async () => {
  const cleanName = name.trim();
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // 1. Update the Database
      await axios.put(`${API_URL}/api/auth/complete-onboarding`, 
        { username: cleanName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // 2. Update LocalStorage
    localStorage.setItem("userName", cleanName);
    
    // 3. Update State (using functional update to preserve existing user data)
    setUser(prev => ({ ...prev, username: cleanName }));
    
    navigate("/analyze");
  } catch (err) {
    console.error("Failed to save onboarding status:", err);
    // Even if DB fails, update local state so UI looks correct
    setUser(prev => ({ ...prev, username: cleanName }));
    navigate("/analyze");
  }
};
  return (
    <div className="min-h-screen  sm:bg-[#F1F5F9] sm:p-6 bg-white flex justify-center font-sans overflow-hidden pt-8 ">
      <div className="w-full max-w-md lg:max-w-2xl sm:min-h-[850px] sm:rounded-[3rem] sm:shadow-2xl bg-white flex flex-col relative px-6 lg:px-16 pt-10 lg:pt-20 lg:border lg:border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <h1 className="text-[24px] lg:text-[32px] font-['Sora'] text-start font-semibold text-[#000000] leading-tight">
          Hi, I’m Clear Clause
        </h1>
        <p className="text-[#333333] lg:text-[18px] text-start font-['Sora'] text-[16px] mt-4 leading-relaxed font-normal ">
          Your personal document scanner. <br />
          I help you spot unclear, risky, or <br />
          potentially unfair terms before you sign.
        </p>

        {/* Input Section */}
        <div className="mt-16">
          <label className="text-[16px] lg:text-[18px] text-start font-['Sora'] font-normal text-gray-800 block mb-2">
            What should I call you ?
          </label>
          <input
            type="text"
            autoFocus
            placeholder="Maxwell"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#D8DADC] lg:py-6 lg:text-[20px] shadow-sm font-['Sora'] rounded-2xl py-5 px-6 text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-[#00000080] text-[16px]"
          />
        </div>

        <div className="mt-12 h-24 lg:mt-16 flex justify-center sm:justify-center"> 
          {name.trim().length > 0 && (
            /* MODIFIED: Added a max-width for laptop so the button doesn't stretch too far, and added a hover lift effect */
            <div className="w-full lg:max-w-[480px]">
                <PremiumButton 
                    text="Proceed" 
                    onClick={handleProceed} 
                />
            </div>
          )}
        </div>

        {/*  Bottom decorative text for Laptop */}
        <div className="hidden lg:block absolute bottom-10 left-0 right-0 text-center text-gray-300 text-[12px] font-medium">
            Privacy First • Secured with AI
        </div>

{/* ACKNOWLEDGEMENT MODAL */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[4px] lg:backdrop-blur-[8px] animate-in fade-in duration-500">
    
    {/* THE MODAL CARD */}
    <div className="bg-white lg:max-w-lg sm:rounded-[40px] lg:p-12 text-start pb-20 pt-10 w-full max-w-md rounded-t-[30px] sm:rounded-[30px] p-8 shadow-2xl relative custom-modal-slide">
      
      {/* Close Button */}
      <button 
        onClick={() => setShowModal(false)}
        className="absolute top-6 left-8 text-black hover:text-gray-600 transition-opacity active:scale-90"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="mt-10">
        <h2 className="text-[18px] leading-[20px] lg:text-[22px] font-semibold text-black mb-2 font-['Sora'] ">Data Privacy:</h2>
        <p className="text-[14px] lg:text-[15px] leading-[20px] text-[#000000] font-['Sora'] mb-6 font-normal">
          ClearClause protects your document information.
          Uploaded source files are removed after text extraction. To provide your analysis and Ask ClearClause, we retain the extracted text and analysis securely for your account. It is not shared or used for training.
        </p>

        <h2 className="text-[18px] leading-[20px] lg:text-[22px] font-semibold text-black font-['Sora'] mb-2">Updates to These Terms:</h2>
        <p className="text-[14px]/[20px] text-[#000000] lg:text-[15px] font-['Sora'] mb-10 font-normal leading-[20px]">
          We may update these terms to improve clarity, security, or functionality. Any changes will be reflected within the app before taking effect. Continued use of Clear Clause means you accept the updated terms.
        </p>

        <div className="hover:scale-[1.01] transition-transform">
          <PremiumButton 
            text="Agree & Continue" 
            onClick={handleFinalAgreement} 
          />
        </div>
      </div>
    </div>

    {/* CUSTOM ANIMATION ENGINE */}
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes modalSlideUp {
        0% { 
          transform: translateY(100%) scale(0.95); 
          opacity: 0; 
        }
        100% { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
      }

      .custom-modal-slide {
        animation: modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}} />
  </div>
)}
      </div>
    </div>
  );
}
