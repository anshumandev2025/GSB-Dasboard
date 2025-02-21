import { useEffect, useState } from "react";
import useToast from "../hooks/useToast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { baseURL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toogleEye, setToggleEye] = useState(false);
  const navigate = useNavigate();
  const { errorToast, successToast } = useToast();
  const { login, isLoggedIn } = useAuth();
  console.log("isLoggedInd-->", isLoggedIn);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/auth/login/employee`, {
        email,
        password,
      });
      login(response.data.token);
      successToast(response.data.message);
      navigate("/products");
    } catch (error) {
      errorToast(error.response.data.message);
      console.log("error:", error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/products");
    }
  }, [isLoggedIn]);
  return (
    <div className="min-h-screen px-5 w-full flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Login to GSB Dashboard
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-10">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={toogleEye ? "password" : "text"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div
                onClick={() => setToggleEye(!toogleEye)}
                className="absolute right-5 cursor-pointer top-2"
              >
                {toogleEye ? <Eye color="black" /> : <EyeOff color="black" />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Forgot your password?
              </Link>
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
