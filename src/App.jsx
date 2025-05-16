import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Planner from "./pages/Planner";
import Discounts from "./pages/Discounts";
import Tips from "./pages/Tips";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/budget" element={
          <>
            <Navbar />
            <Budget />
          </>
        } />
        <Route path="/planner" element={
          <>
            <Navbar />
            <Planner />
          </>
        } />
        <Route path="/discounts" element={
          <>
            <Navbar />
            <Discounts />
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