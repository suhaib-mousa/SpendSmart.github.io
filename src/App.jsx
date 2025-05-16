import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Planner from "./pages/Planner";
import Discounts from "./pages/Discounts";
import Tips from "./pages/Tips";
import CategoryPage from "./pages/CategoryPage.jsx";
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App;