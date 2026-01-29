import React from 'react';
import { useNavigate } from 'react-router-dom';
import phoneLayout from "../assets/fullPhoneImg.png"
import PremiumButton from '../components/PremiumBtn';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6">
      <div className="w-full max-w-md flex flex-col items-center text-center animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="mt-4 space-y-4">
          <h1 className="text-[30px] font-['Sora'] font-bold text-black tracking-tight leading-tight px-2">
            Spot <span className="text-[#0057B8]">unfair clauses</span> instantly
          </h1>
          <p className="text-[#8E8E8E] text-[16px] font-['Sora'] leading-relaxed px-6 ">
            Our AI flags ambiguous terms and potentially unfair clauses, 
            helping you make informed decisions before signing anything.
          </p>
        </div>

        {/* The Graphic Mockup (Matches start.png) */}
        <div className="relative my-10 w-full flex justify-center">
          {/* Outer Phone Frame */}
          <div className="relative z-10 w-60  overflow-hidden flex flex-col">
            
            {/* Internal Phone UI */}
            <img src={phoneLayout} alt="" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-5 px-2 mt-auto pb-6">
          
            <PremiumButton 
                text="Get Started" 
                onClick={() => navigate("/register")}
            />
          <button
            onClick={() => navigate("/login")}
            className="block font-['Sora'] text-[16px] w-full text-[#333333] text-[14px] hover:text-[#00ABFF] transition-colors"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;