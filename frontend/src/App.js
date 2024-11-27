import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SigninSignup from "./pages/SigninSignup";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Router>
      <Routes>
        {/* Unified Signin/Signup Component */}
        <Route path="/signup" element={<SigninSignup />} />
        <Route path="/signin" element={<SigninSignup />} />

        {/* Transactions page (protected route logic can be added later) */}
        <Route path="/transactions" element={<Transactions />} />

        {/* Default route redirects to /signin */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
