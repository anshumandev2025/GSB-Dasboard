import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
