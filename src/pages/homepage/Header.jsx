import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext, ProductContext } from "../../context/Context";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Search from "../products/Search";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, openCart } = useContext(ProductContext);
  const { user, openAccount } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = () => {
    if (!user) {
      alert("user not logged in");
      navigate("/login", { state: { from: location.pathname } });
    } else {
      openCart();
    }
  };

  const handleAccountClick = () => {
    if (!user) {
      alert("user not logged in");
      navigate("/login", { state: { from: location.pathname } });
    } else {
      openAccount();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 top-0 z-20">
      <div className="w-full">
        <div className="text-center bg-black text-white py-2 px-4">
          Receive $20 off your first order. Sign up for emails.
        </div>

        <nav
          className="flex items-center justify-between py-4"
          aria-label="Primary"
        >
          <Link to="/" className="flex-shrink-0">
            <div className="text-8xl font-black w-32 h-8 px-6 py-3 inline">
              SNEACAVE
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setOpenSearch(!openSearch)}
              className="hidden lg:block font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            {user ? (
              <div
                className="hidden lg:block font-medium cursor-pointer"
                onClick={handleAccountClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
            ) : (
              <div className="hidden lg:block font-medium">
                <Link
                  className="decoration-transparent hover:decoration-black"
                  to="/login"
                >
                  Log in
                </Link>
              </div>
            )}

            <div
              className="font-medium cursor-pointer flex"
              onClick={handleCartClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              ({cart.length})
            </div>

            {/* hamburger menu */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </nav>

        {/* mobile view */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/50">
            <div className="fixed right-0 top-0 w-64 h-full bg-white p-6 flex flex-col shadow-lg border-l border-gray-200 transform transition-transform duration-300">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 self-end text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>

              <div
                className="mb-2 px-2 py-2 rounded hover:bg-gray-100 font-medium cursor-pointer"
                onClick={() => {
                  setOpenSearch(!openSearch);
                  setMobileMenuOpen(false);
                }}
              >
                Search
              </div>

              {user ? (
                <div
                  className="mb-2 px-2 py-2 rounded hover:bg-gray-100 font-medium cursor-pointer"
                  onClick={() => {
                    handleAccountClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  Account
                </div>
              ) : (
                <div className="mb-2 px-2 py-2 rounded hover:bg-gray-100 font-medium cursor-pointer">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="decoration-transparent hover:decoration-black"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {openSearch && <Search onClose={() => setOpenSearch(false)} />}
    </header>
  );
}
