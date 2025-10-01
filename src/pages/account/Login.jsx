import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/Context";
import { showToast } from "../../lib/toast";
import { useState, useContext } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { login } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  try {
    const result = await login(user);
    if (result.success) {
      if (result.user.isBlocked) {
    setError("Your account has been blocked. Please contact support.");
    showToast.error("Your account has been blocked. Please contact support.");
    return;
  }

      showToast.success("Logged in successfully");
      
      if (result.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message);
      showToast.error(result.message);
    }
  } catch (error) {
    const errorMessage = error.message || "Login failed. Please try again.";
    setError(errorMessage);
    showToast.error(errorMessage);
  }
};


  return (
    <>
      <div className="flex min-h-full flex-col justify-center pt-40 px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Login
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`block w-full px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 
                    focus:outline-2 focus:outline-gray-700 sm:text-sm/6 ${
                      error ? "border-red-500 outline-red-500" : "bg-white"
                    }`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className={`block w-full px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-700 sm:text-sm/6
                     ${error ? "border-red-500 outline-red-500" : "bg-white"}`}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium"> {error} </p>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center cursor-pointer bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-gray-700"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm/6 text-gray-500">
            <div className="flex items-center justify-between">
              <Link
                className="block text-sm/6 font-medium text-gray-900  hover:text-gray-600"
                to="/register"
              >
                Create Account
              </Link>
              <div className="text-sm">
                <a className="font-semibold cursor-pointer text-gray-900 hover:text-gray-600">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}