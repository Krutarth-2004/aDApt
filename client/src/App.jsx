import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import Navbar from "./components/Navbar.jsx";
import HomePg from "./pages/HomePg.jsx";
import SignUpPg from "./pages/SignupPg.jsx";
import LoginPg from "./pages/LoginPg.jsx";
import QnAPg from "./pages/QnAPg.jsx";
import SharedlibPg from "./pages/SharedlibPg.jsx";
import EmailPg from "./pages/EmailPg.jsx";
import LostPg from "./pages/LostPg.jsx";
import FoundPg from "./pages/FoundPg.jsx";
import QnAForm from "./components/QnAForm.jsx";
import LnFForm from "./components/LnFForm.jsx";
import EmailForm from "./components/EmailForm.jsx";
import SharedlibForm from "./components/SharedlibForm.jsx";

import { useAuthStore } from "./store/authStore.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <main className="min-h-screen pt-4 px-4 md:px-8">
        <Routes>
          <Route path="/" element={<HomePg />} />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPg /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPg /> : <Navigate to="/" />}
          />
          <Route
            path="/qna"
            element={authUser ? <QnAPg /> : <Navigate to="/login" />}
          />
          <Route
            path="/sharedlib"
            element={authUser ? <SharedlibPg /> : <Navigate to="/login" />}
          />
          <Route
            path="/emails"
            element={authUser ? <EmailPg /> : <Navigate to="/login" />}
          />
          <Route
            path="/lost"
            element={authUser ? <LostPg /> : <Navigate to="/login" />}
          />
          <Route
            path="/found"
            element={authUser ? <FoundPg /> : <Navigate to="/login" />}
          />
          <Route
            path="/qna_upload"
            element={authUser ? <QnAForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/lnf_upload"
            element={authUser ? <LnFForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/mail_upload"
            element={authUser ? <EmailForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/file_upload"
            element={authUser ? <SharedlibForm /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
