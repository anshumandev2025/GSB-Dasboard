import React, { useEffect, useState } from "react";
import Sidebar from "./components/common/SideBar";
import { Routes, Route } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase/firebaseConfig";
const App = () => {
  useEffect(() => {
    const auth = getAuth(app);

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User signed in:", currentUser);
      } else {
        console.log("No user is signed in");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex h-screen  bg-gray-900 text-gray-100">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SigninPage />} />
      </Routes>
    </div>
  );
};

export default App;
