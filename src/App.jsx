import React, { useEffect, useState } from "react";
import Sidebar from "./components/common/SideBar";
import { Routes, Route } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
// import HomePage from "./pages/HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase/firebaseConfig";
import EmployeePage from "./pages/EmployeePage";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import VideoPage from "./pages/VideoPage";
import DietPdfTable from "./components/table/DietPdfTable";
import DietPdfPage from "./pages/DietPdfPage";
const App = () => {
  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100">
      <Sidebar />
      <Routes>
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/videos" element={<VideoPage />} />
        <Route path="/diet-pdf" element={<DietPdfPage />} />
      </Routes>
    </div>
  );
};

export default App;
