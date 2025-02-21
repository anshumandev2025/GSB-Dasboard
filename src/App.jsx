import React, { useEffect, useState } from "react";
import Sidebar from "./components/common/SideBar";
import { Routes, Route } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import EmployeePage from "./pages/EmployeePage";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import VideoPage from "./pages/VideoPage";
import DietPdfPage from "./pages/DietPdfPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
const App = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100">
      {isLoggedIn && <Sidebar />}
      <Routes>
        <Route path="/sign-in" element={<SigninPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/diet-pdf" element={<DietPdfPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
