import React, { useState } from "react";
import PremiumButton from "../components/PremiumBtn";
import { useNavigate } from "react-router-dom"; 

export default function OnboardingName({ setUser }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Controls the popup

  const handleProceed = () => {
    if (name.trim()) {
      // 1. Saving to state so the Greeting Toast can use it
      setUser({ username: name.trim() });
      // When user clicks "Proceed", show the Privacy Modal
      setShowModal(true);
      
      // 2. Persist it in localStorage 
      localStorage.setItem("userName", name.trim());
      
    }
  };


  //  When user clicks "Agree & Continue" inside the Modal
  const handleFinalAgreement = () => {
    setUser({ username: name.trim() });
    localStorage.setItem("userName", name.trim());
    navigate("/analyze");
  };

  return (
    <div className="min-h-screen  sm:bg-[#F1F5F9] sm:p-6 bg-white flex justify-center font-sans overflow-hidden pt-10 ">
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
            <div className="w-full lg:max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-500 transition-transform hover:-translate-y-1">
                <PremiumButton 
                    text="Proceed" 
                    onClick={handleProceed} 
                />
            </div>
          )}
        </div>

        {/* MODIFIED: Bottom decorative text for Laptop */}
        <div className="hidden lg:block absolute bottom-10 left-0 right-0 text-center text-gray-300 text-[12px] font-medium">
            Privacy First • Secured with AI
        </div>


        {/* ACKNOWLEDGEMENT MODAL */}
        {showModal && (
          <div className=" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] lg:backdrop-blur-[6px] animate-in fade-in duration-300">
            <div className="bg-white lg:max-w-lg sm:rounded-[40px] lg:p-12 sm:zoom-in-95 text-start pb-20 pt-10 w-full max-w-md rounded-t-[20px] sm:rounded-[20px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 left-8 text-black hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mt-10">
                <h2 className="text-[18px] leading-[20px] lg:text-[22px]  font-semibold text-black mb-2 font-['Sora'] ">Data Privacy:</h2>
                <p className="text-[14px] lg:text-[15px] leading-[20px] text-[#000000] font-['Sora'] mb-6 font-normal">
                  In case you’re wondering whether Clear Clause stores your documents — no, we don’t. 
                  Files you upload are processed securely and are not saved, shared, or used for training purposes. <br />
                  Once analysis is complete, your document is discarded automatically. 
                  Your data stays yours. Always.
                </p>

                <h2 className="text-[18px] leading-[20px] lg:text-[22px] font-semibold text-black font-['Sora'] mb-2">Updates to These Terms:</h2>
                <p className="text-[14px]/[20px] text-[#000000] lg:text-[15px] font-['Sora'] mb-10 font-normal leading-[20px]">
                  We may update these terms to improve clarity, security, or functionality. 
                  Any changes will be reflected within the app before taking effect. 
                  Continued use of Clear Clause means you accept the updated terms. 
                  Transparency is part of the deal.
                </p>

                <PremiumButton 
                  text="Agree & Continue" 
                  onClick={handleFinalAgreement} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}