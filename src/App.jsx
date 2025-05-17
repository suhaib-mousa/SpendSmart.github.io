import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Planner from "./pages/Planner";
import Discounts from "./pages/Discounts";
import Tips from "./pages/Tips";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import './styles/global.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/budget" element={
          <>
            <Navbar />
            <Budget />
            <Footer />
          </>
        } />
        <Route path="/planner" element={
          <>
            <Navbar />
            <Planner />
            <Footer />
          </>
        } />
        <Route path="/discounts" element={
          <>
            <Navbar />
            <Discounts />
            <Footer />
          </>
        } />
        <Route path="/category/:categoryName" element={
          <>
            <Navbar />
            <CategoryPage />
          </>
        } />
        <Route path="/tips" element={
          <>
            <Navbar />
            <Tips />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;