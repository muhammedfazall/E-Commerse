import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/Context";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      <header className="bg-black text-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold text-gray-300">SNEACAVE</h1>
            <div className="h-8 w-px bg-gray-700"></div>
            <h2 className="text-xl text-gray-400 font-semibold">Admin Panel</h2>
          </div>

          <div className="flex items-center space-x-3 relative" ref={profileRef}>
            <div className="text-right hidden sm:block">
              <span className="text-sm font-medium text-gray-300 block">
                {user?.name || "Admin User"}
              </span>
              <span className="text-xs text-gray-400 block">
                {user?.email || "admin@example.com"}
              </span>
            </div>
            
            <div className="relative">
              <button 
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors border border-gray-600"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {user?.name ? (
                  <span className="text-gray-300 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-gray-200">{user?.name || "Admin User"}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || "admin@example.com"}</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Fixed Sidebar */}
        <aside className="w-64 bg-gray-900 text-white shadow-xl fixed top-16 left-0 bottom-0 z-40 border-r border-gray-800">
          <nav className="p-4 h-full overflow-y-auto">
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold px-3 mb-3">
                Main Menu
              </h3>
              <div className="space-y-1">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 border ${
                      isActive
                        ? "bg-gray-800 text-white border-gray-600 shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-transparent hover:border-gray-700"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 border ${
                      isActive
                        ? "bg-gray-800 text-white border-gray-600 shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-transparent hover:border-gray-700"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Users
                </NavLink>

                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 border ${
                      isActive
                        ? "bg-gray-800 text-white border-gray-600 shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-transparent hover:border-gray-700"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Products
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-lg transition-all duration-200 border ${
                      isActive
                        ? "bg-gray-800 text-white border-gray-600 shadow-lg"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200 border-transparent hover:border-gray-700"
                    }`
                  }
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Orders
                </NavLink>
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-gray-100 ml-64 mt-16 min-h-screen">
          <div className="p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}