import React from 'react';
import { useNavigate } from 'react-router-dom';
import phoneLayout from "../assets/fullPhoneImg.png"
import PremiumButton from '../components/PremiumBtn';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6 lg:p-12">
      {/* Container: No shadow on mobile, big shadow on laptop */}
      <div className="w-full max-w-md lg:pt-8 lg:max-w-6xl bg-white sm:rounded-[3rem] lg:shadow-2xl flex flex-col lg:flex-row items-center text-center lg:text-left animate-in fade-in duration-700 relative">
        
        {/* TEXT SECTION: On top for mobile, on the left for laptop */}
        <div className="mt-4 lg:mt-0 lg:flex-1 lg:pl-16 lg:pr-10">
          <div className="space-y-4">
            <h1 className="text-[30px] lg:text-[50px] font-['Sora'] font-bold text-black tracking-tight leading-tight lg:leading-[1.1]">
              Spot <span className="text-[#0057B8]">unfair clauses</span> instantly
            </h1>
            <p className="text-[#8E8E8E] lg:text-[18px] text-[16px] font-['Sora'] leading-relaxed px-2 lg:px-0 lg:max-w-md">
              Our AI flags ambiguous terms and potentially unfair clauses, 
              helping you make informed decisions before signing anything.
            </p>
          </div>

          {/* ACTION BUTTONS: On laptop, these move under the text on the left */}
          <div className="hidden lg:flex flex-col w-full max-w-[320px] space-y-5 mt-10">
            <PremiumButton 
                text="Get Started" 
                onClick={() => navigate("/register")}
            />
            <button
              onClick={() => navigate("/login")}
              className="font-['Sora'] text-[#333333] text-[15px] font-semibold hover:text-[#00ABFF] transition-colors text-center"
            >
              I already have an account
            </button>
          </div>
        </div>

        {/* PHONE IMAGE SECTION: In the middle for mobile, on the right for laptop */}
        <div className="relative my-10 lg:my-0 lg:flex-1 w-full flex justify-center group">
          {/* Glowing Aura stays behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 lg:w-80 lg:h-80 bg-blue-400/20 rounded-full blur-[60px] group-hover:bg-blue-400/30 transition-colors duration-700"></div>
          
          <div className="relative z-10 w-60 lg:w-80 flex flex-col animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            <div className="animate-[float_6s_ease-in-out_infinite]">
              <img 
                src={phoneLayout} 
                alt="Phone Layout" 
                className="transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* MOBILE BUTTONS: Only shows on mobile, below the phone image */}
        <div className="w-full space-y-5 px-2 mt-auto pb-6 lg:hidden">
          <PremiumButton 
              text="Get Started" 
              onClick={() => navigate("/register")}
          />
          <button
            onClick={() => navigate("/login")}
            className="block font-['Sora'] w-full text-[#333333] text-[14px] hover:text-[#00ABFF] transition-colors"
          >
            I already have an account
          </button>
        </div>

        {/* Decorative element - Laptop only */}
        <div className="hidden lg:block absolute bottom-6 left-16 text-[10px] text-gray-300 font-medium tracking-widest uppercase">
          Secure • AI-Powered • Legal Companion
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .fill-mode-both { animation-fill-mode: both; }
        `}} />
      </div>
    </div>
  );
};

export default WelcomeScreen;