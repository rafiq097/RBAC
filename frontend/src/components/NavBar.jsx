import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom.js";
import { useNavigate, Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import Spinner from "../components/Spinner.jsx";

function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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
      const res = await axios.put('/users/toggle-status', {}, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      toast.success("Toggled Successfully");
      setIsActive(res.data.user.isActive);
      console.log('Updated User:', res.data.user);
  } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to toggle status');
  }

  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="/">AssignIt</a>
        </div>

        {/* Menu Toggle for Mobile */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <Link
                to="/"
                className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {user?.role !== "user" && (
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-blue-500 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="px-4 py-2">
                <span className="text-blue-500">Status:</span>
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
                className="block w-full px-4 py-2 text-blue-500 hover:bg-gray-100"
                onClick={handleLogout}
              >
                LogOut
              </button>
            </div>
          )}
        </div>

        {/* Links for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          {user?.role !== "user" && (
            <div className="flex items-center space-x-3">
              <Link to="/dashboard" className="text-white hover:text-gray-200">
                Dashboard
              </Link>
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
            </div>
          )}
          <button
            className="flex items-center text-white hover:text-gray-200"
            onClick={handleLogout}
          >
            <span>Logout</span>
            <MdLogout size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
