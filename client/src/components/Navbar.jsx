import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // ✅ import the Zustand store
import { UserCircle } from "lucide-react"; // ✅ optional icon (Lucide)
import { useLocation } from "react-router-dom";
import logo from "../assets/user.jpg";

const Navbar = () => {
  const { authUser, logout } = useAuthStore(); // ✅ get authUser from store
  const navigate = useNavigate(); // ✅ for navigation
  const location = useLocation();
  const currentPath = location.pathname;
  const [lnfOpen, setLnfOpen] = useState(false);
  const lnfRef = useRef();

  // 🧠 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (lnfRef.current && !lnfRef.current.contains(e.target)) {
        setLnfOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚀 Close dropdown on route change
  useEffect(() => {
    setLnfOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout(); // Calls the Zustand logout function
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div>
      <div className="navbar bg-primary text-primary-content fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="navbar-start">
          {/* ... (unchanged dropdown and logo) */}
          <Link to="/" className="btn btn-ghost text-2xl">
            aDApt
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-6 text-lg font-semibold items-center relative">
            <li>
              <Link
                to="/qna"
                className={`transition duration-200 ${
                  currentPath === "/qna"
                    ? "text-white underline underline-offset-4"
                    : "hover:text-white hover:underline underline-offset-4"
                }`}
              >
                QnA
              </Link>
            </li>
            <li>
              <Link
                to="/sharedlib"
                className={`transition duration-200 ${
                  currentPath === "/sharedlib"
                    ? "text-white underline underline-offset-4"
                    : "hover:text-white hover:underline underline-offset-4"
                }`}
              >
                Library
              </Link>
            </li>
            <li>
              <Link
                to="/emails"
                className={`transition duration-200 ${
                  currentPath === "/emails"
                    ? "text-white underline underline-offset-4"
                    : "hover:text-white hover:underline underline-offset-4"
                }`}
              >
                ImpMails
              </Link>
            </li>

            {/* LnF Dropdown - Click to Toggle */}
            <li ref={lnfRef} className="relative">
              {/* LnF Button */}
              <div
                tabIndex={0}
                role="button"
                onClick={() => setLnfOpen((prev) => !prev)}
                className={`transition duration-200 text-lg font-semibold cursor-pointer ${
                  currentPath.startsWith("/lost") ||
                  currentPath.startsWith("/found")
                    ? "text-white underline underline-offset-4"
                    : "hover:text-white hover:underline underline-offset-4"
                }`}
              >
                LnF
              </div>

              {/* Dropdown Menu */}
              {lnfOpen && (
                <ul className="absolute top-full right-0 mt-2 bg-base-100 shadow rounded-md w-40 z-[100]">
                  <li>
                    <Link
                      to="/lost"
                      onClick={() => setLnfOpen(false)} // ✅ close dropdown on click
                      className={`block px-4 py-2 text-base rounded-md transition ${
                        currentPath === "/lost"
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white text-black"
                      }`}
                    >
                      Lost
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/found"
                      onClick={() => setLnfOpen(false)} // ✅ close dropdown on click
                      className={`block px-4 py-2 text-base rounded-md transition ${
                        currentPath === "/found"
                          ? "bg-primary text-white"
                          : "hover:bg-primary hover:text-white text-black"
                      }`}
                    >
                      Found
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-4 me-4">
          {authUser ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-500 ring-offset-0 overflow-hidden">
                  <img src={logo} alt="User Logo" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/update-profile" className="text-lg text-black">
                    Update Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-lg text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn text-xl me-2">
                Login
              </Link>
              <Link to="/signup" className="btn text-xl">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
