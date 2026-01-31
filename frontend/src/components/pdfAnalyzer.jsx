import { useState, useEffect } from "react";
import loadingicon from "../assets/loading.png"
import PremiumButton from "./PremiumBtn";
import uploadIcon from "../assets/Frame.png"
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PdfRiskAnalyzer() {
  const [file, setFile] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [step, setStep] = useState("upload");
  const [user, setUser] = useState(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

const resetAnalyzer = () => {
  setFile(null);
  setUploadProgress(0);
  setChunks([]);
  setError("");
  setStep("upload");
};

useEffect(() => {
  const initUser = async () => {
    // 1. Get whatever we have in storage
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");

    // 2. Prioritize Database User (Token)
    if (token) {
      try {
        const { data } = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        triggerToast();
        return; 
      } catch (err) {
        console.error("Token invalid, falling back to guest name");
        localStorage.removeItem("token");
      }
    }

    // 3. Fallback to Guest Name (Onboarding)
    if (savedName) {
      setUser({ username: savedName });
      triggerToast();
    }
  };

  const triggerToast = () => {
    setShowGreeting(true);
    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  };

  initUser();
}, []); 

useEffect(() => {
  if (uploadProgress === 100 && file && step === "upload") {
    // Small delay so the user can see 100% before it switches
    const timer = setTimeout(() => {
      handleUpload();
    }, 500);
    return () => clearTimeout(timer);
  }
}, [uploadProgress, file, step]);

// automatic upload
const handleUpload = async () => {
  if (!file) return; 

  try {
    setLoading(true);
    setStep("scanning"); 
    
    const formData = new FormData();
    formData.append("pdf", file);

    const { data } = await axios.post(`${API_URL}/api/pdf/upload`, formData);
    
    // Pass chunks to analysis
    await handleAnalyze(data.chunks); 
    
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Analysis failed. Please try again.";
    setStep("upload");
    setError(errorMsg);
    setError("Analysis failed. Please try again.");
    setUploadProgress(0); 
  } finally {
    setLoading(false);
  }
};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadProgress(0);

    // Simulate progress bar as seen in design
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 50);
  };


  const handleAnalyze = async (chunksData) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/pdf/analyze`, { chunks: chunksData });
      // Check if Gemini rejected it as a non-legal document
    if (data.analyzedChunks[0]?.is_legal === false) {
       setError(data.analyzedChunks[0].error);
       setStep("upload");
       return;
    }
      
      setChunks(data.analyzedChunks);
      setStep("result");
      
    } catch {
      setError("Failed to analyze content.");
      setStep("upload");
    }
  };


useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      setError("");
    }, 5000); // Disappears after 5 seconds
    return () => clearTimeout(timer);
  }
}, [error]);

const handleDownload = () => {
  const riskyChunks = chunks.filter(c => c.risk && c.risk !== "Low");
  
  if (riskyChunks.length === 0) {
    alert("No risky clauses found to download.");
    return;
  }

  // Formatting the Review Document
  let content = `LEGAL RISK REVIEW REPORT\n`;
  content += `Document: ${file ? file.name : "Unknown"}\n`;
  content += `Date: ${new Date().toLocaleDateString()}\n`;
  content += `-------------------------------------------\n\n`;

  riskyChunks.forEach((c, index) => {
    content += `${index + 1}. RISK LEVEL: ${c.risk.toUpperCase()}\n`;
    content += `CLAUSE: "${c.text}"\n`;
    content += `ANALYSIS: ${c.explanation || "No specific reason provided."}\n`;
    content += `-------------------------------------------\n\n`;
  });

  content += `\nDisclaimer: This report is AI-generated and should not replace a lawyer's opinion.`;

  // Create a blob and download it
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${file?.name.replace(/\.[^/.]+$/, "")}_Legal_Review.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const handleLogout = () => {
  console.log("Logging out..."); // Check if this shows in your console
  
  // Clear everything
  localStorage.clear(); 
  
  if (typeof setUser === "function") {
    setUser(null);
  }

  setIsMenuOpen(false);

  // Force navigate to register
  setTimeout(() => {
    navigate("/register");
  }, 10);
};

  const compromised = chunks.some((c) => c.risk === "High");


  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 sm:py-10 font-['Sora']">
      <div className="w-full max-w-md lg:max-w-2xl bg-white min-h-screen sm:min-h-[850px] sm:rounded-[3rem] sm:shadow-2xl relative overflow-hidden flex flex-col border border-gray-100">
        {step === "upload" && (
        <div className="px-6 lg:px-10 pt-12 pb-4 flex justify-between items-center">
          {/* left side */}
          <div className="flex flex-col items-start space-y-0.5">
            <p className="text-[13px] lg:text-[17px] font-['Sora'] text-[#000000] font-bold-400 font-medium leading-none mb-2">
              Welcome!
            </p>
            <h2 className="text-[15px] lg:text-[17px] font-bold text-[#000000] capitalize leading-tight tracking-tight">
              {user?.username || "Guest"} 👋
            </h2>
          </div>
        
          {/* right side: menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-[#0000000A] lg:hidden p-2.5 rounded-full active:scale-90 transition-transform">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}            </svg>
          </button>
        </div>
        )}

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-[50] lg:hidden" 
              onClick={() => setIsMenuOpen(false)} 
            />

            {/* Floating Menu Card */}
            <div className="absolute right-6 top-24 w-56 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 z-[55] lg:hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
              <div className="p-2 flex flex-col">
                
                {/* Navigation Links */}
                <button onClick={() => { navigate("/Onboarding"); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 rounded-2xl transition-colors text-gray-700 active:bg-blue-50">
                  <span className="text-lg">👋</span>
                  <span className="text-[14px] font-bold font-['Sora']">Go back to</span>
                </button>

                {/* Divider */}
                <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 rounded-2xl transition-colors text-red-500 active:bg-red-100"
                >
                  <span className="text-lg">🚪</span>
                  <span className="text-[14px] font-bold font-['Sora']">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="px-6 lg:px-12 flex-1 flex flex-col relative" style={{marginTop:'3rem'}}>
          {/* UPLOAD SCREEN */}
          {step === "upload" && (
            <div className="animate-in fade-in duration-500">

              <div className="h-10 mb-2">
                  {error && (
                    <div className="animate-toast bg-red-50 text-red-600 text-[12px] lg:text-[18px] p-2 rounded-lg text-center font-medium border border-red-100">
                      ⚠️ {error}
                    </div>
                  )}
               </div>

              <h1 className="text-[18px] lg:text-[24px] font-normal text-start text-[#000000] leading-[26px] mb-3">
                Clear Clause your Legal AI Companion
              </h1>
              <p className="text-[#696969] text-start text-[14px] lg:text-[16px] leading-relaxed">
                Upload your legal document to scan for little errors and mistake
              </p>

              {/* UPLOAD BOX */}
              <div className="mt-8 bg-[#c5e3ff] rounded-3xl p-5 border border-blue-50">
                <p className="text-[#0073FF] font-['Sora'] text-[12px] line-height[21px] text-start mb-4 lg:text-[16px] ">Upload a document</p>
                
                <label className="cursor-pointer block bg-white p-[7px] rounded-[10px]">
                  <div className="bg-white/50 lg:p-16 border-[1px] border-dashed border-[#E9E9E9] rounded-[10px] p-[10px] flex flex-col items-center justify-center">
                    <div className="flex text-center flex-col items-center justify-center ">
                      <img src={uploadIcon} alt="icon" />
                      {/* <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg> */}
                    <p className="text-[12px] text-[#000000]font-bold-400 font-['Sora'] lg:text-[16px]">Drag and drop or <span className="text-[#0073FF] underline ">choose file</span> to upload.</p>
                    <p className="text-[12px] text-[#000000] mt-1 font-['Sora'] lg:text-[16px]">Image formart: PDF, DOCS, PNG. Max 5.0MB</p>
                    </div>
                  </div>
                  <input type="file" accept="application/pdf, 
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
                    image/png, 
                    image/jpeg" 
                    onChange={handleFileChange} 
                    className="hidden" />
                </label>

                {file && (
                  <div className="mt-4 bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm relative">
                    <div className={`p-3 rounded-xl text-white text-white text-[10px] font-bold ${
                      file.type.includes('pdf') ? 'bg-red-500' : 
                      file.type.includes('image') ? 'bg-purple-500' : 'bg-blue-500'
                    }`}>
                      {file.name.split('.').pop().toUpperCase()}
                    </div>
                    {/* <div className="bg-blue-500 p-2 rounded-lg text-white text-[10px] font-bold">.DOC</div> */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-gray-700 truncate w-32">{file.name}</p>
                        <p className="text-[10px] text-gray-400">{uploadProgress}%</p>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00ABFF] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-[8px] text-start text-[#00000085] font-['Sora'] mt-1">10.6KB of 5.0MB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="text-gray-400 font-['Sora']">✕</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* SCANNING STATE */}
          {step === "scanning" && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 px-10 text-center">
              <img src={loadingicon} alt="" 
              className="mb-3 lg:mb-2 lg:p-20 bject-contain transition-all duration-700 animate-pulse" 
                />

              <p className="text-[16px] font-['Sora'] lg:text-[18px] font-normal text-gray-800 leading-[21px] ">
                This may take a few minutes while we analyze your document...
              </p>
    
              <div className="mt-8">
                <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          {/* RESULT SCREEN */}
          {step === "result" && (
            <div className="animate-in slide-in-from-bottom-6 duration-700 pb-10 h-full flex flex-col">
              <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm mt-4">
                <div className={`p-2 rounded-lg ${compromised ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-[13px] font-['Sora'] font-medium text-gray-800">
                  Document Integrity - <span className={compromised ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                    {compromised ? "Compromised" : "Secure"}
                  </span>
                </p>
              </div>

             {/*  DATA RESULTS */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 mb-6 overflow-hidden min-h-[400px]">
              <h3 className="text-[14px] font-bold text-gray-800 text-center mb-8">
                  {file ? file.name.replace(/\.[^/.]+$/, "") : "Document Analysis"}
              </h3>
              <div className="space-y-6">
                {chunks.map((c, i) => (
                  <div key={i} className="relative pl-4">
                    {/* Visual Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full ${
                      c.risk === 'High' ? 'bg-red-500' : 
                      c.risk === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />

                    <p className="text-[10px] leading-relaxed text-gray-600 font-medium">
                      {c.text}
                    </p>
      
                    <p className={`text-[9px] font-['Sora'] mt-1 italic ${
                      c.risk === 'High' ? 'text-red-500' : 
                      c.risk === 'Medium' ? 'text-orange-400' : 'text-green-500'
                    }`}>
                      {c.risk} Risk: {c.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
                        
              {/* Color Code */}
              <div className="flex justify-between px-2 mb-6">
                <div className="flex items-center gap-2 m-2">
                  <div className="w-4 h-4 bg-green-500 rounded-md"></div>
                  <span className="text-[11px] font-['Sora'] font-bold text-green-600">Secure</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <div className="w-4 h-4 bg-orange-500 rounded-md"></div>
                  <span className="text-[11px] font-['Sora'] font-bold text-orange-600">Reviewed</span>
                </div>
                <div className="flex items-center gap-2 m-2">
                  <div className="w-4 h-4 bg-red-500 rounded-md"></div>
                  <span className="text-[11px] font-['Sora'] font-bold text-red-600">Compromised</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                <p className="text-gray-500 text-[11px] text-center font-medium font-['Sora']">
                  This color code identify your document quality
                </p>
              </div>

            <PremiumButton 
                text="Download Review" 
                onClick={handleDownload} 
            />

            <h4 
            onClick={resetAnalyzer}
            className="text-xm text-center font-['Sora'] mt-6 mb-4 cursor-pointer text-[#0073FF]">
              Scan Again
            </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}