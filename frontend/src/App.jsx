import Register from './components/register';
import Login from './components/login';
import './App.css'
import PdfRiskAnalyzer from './components/pdfAnalyzer';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Terms from './pages/TermsAndServices';
import VerifyEmail from './components/verifyEmail';

function App() {
  const [user, setUser] = useState(null);
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/TermsAndServices" element={<Terms />} />
        <Route path="/analyze" element={<PdfRiskAnalyzer user={user} />} />
        <Route path="/Onboarding" element={<Onboarding setUser={setUser} />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App
