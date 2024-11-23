import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom.js";
import { useNavigate, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import Spinner from "../components/Spinner.jsx";

function NavBar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({});
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const updateRoleStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    updateRoleStatus();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setUserData(null);
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error("Error while logging out");
      console.error("Logout failed", error);
    }
  };

  const toggleActiveStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/users/toggle-status",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Toggled Successfully");
      setIsActive(res.data.user.isActive);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to toggle status");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <header className="w-full bg-blue-500 border-b sticky top-0 z-50 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            AssignIt
          </Link>
        </div>
        <div className="hidden md:flex gap-2 items-center">
          <Link to="/" className="px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-gray-800 h-10 flex items-center text-white">
            Home
          </Link>
          {user?.role !== "user" && (
            <>
              <Link
                to="/dashboard"
                className="px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-gray-800 h-10 flex items-center text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/admin-page"
                className="px-2 py-1 transition-colors duration-200 rounded-lg hover:bg-gray-800 h-10 flex items-center text-white"
              >
                Admin Page
              </Link>
            </>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-white">Active:</span>
            <button
              className={`relative flex items-center w-16 h-8 rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-300"
              } p-1 transition duration-300`}
              onClick={toggleActiveStatus}
            >
              <span
                className={`absolute left-1 text-sm font-bold text-white transition duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                ON
              </span>
              <span
                className={`absolute right-1 text-sm font-bold text-gray-500 transition duration-300 ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                OFF
              </span>
              <div
                className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform ${
                  isActive ? "translate-x-8" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
          <button
            className="flex items-center text-white hover:text-gray-200"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <MdLogout size={22} />
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-500 backdrop-blur-md border-t w-screen">
          <nav className="flex flex-col items-center py-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-left px-2 py-2 transition-colors duration-200 hover:bg-gray-800 text-white"
            >
              Home
            </Link>
            {user?.role !== "user" && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-2 py-2 transition-colors duration-200 hover:bg-gray-800 text-white"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin-page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left px-2 py-2 transition-colors duration-200 hover:bg-gray-800 text-white"
                >
                  Admin Page
                </Link>
              </>
            )}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-white font-medium">Status:</span>
              <button
                className={`relative flex items-center w-16 h-8 rounded-full ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                } p-1 transition duration-300`}
                onClick={toggleActiveStatus}
              >
                <span
                  className={`absolute left-1 text-sm font-bold text-white transition duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  ON
                </span>
                <span
                  className={`absolute right-1 text-sm font-bold text-gray-500 transition duration-300 ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  OFF
                </span>
                <div
                  className={`h-6 w-6 bg-white rounded-full shadow-md transform transition-transform ${
                    isActive ? "translate-x-8" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
            <button
              className="block w-full px-4 py-3 text-white hover:bg-gray-800 transition text-left"
              onClick={handleLogout}
            >
              LogOut
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
