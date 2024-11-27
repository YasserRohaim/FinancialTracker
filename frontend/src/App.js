import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SigninSignup from "./pages/SigninSignup";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SigninSignup />} />
        <Route path="/signup" element={<SigninSignup />} />

        <Route path="/transactions" element={<Transactions />} />

        <Route path="*" element={<Navigate to="/transactions" />} />
      </Routes>
    </Router>
  );
}

export default App;
