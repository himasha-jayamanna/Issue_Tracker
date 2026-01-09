import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Title */}
      <h1 className="font-bold text-2xl text-blue-600 tracking-wide">
        Issue Tracker
      </h1>

      {/* Navigation & Logout */}
      <div className="flex gap-6 items-center">
        {/* Dashboard Tab */}
        <button
          onClick={() => navigate("/dashboard")}
          className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
        >
          Dashboard
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-200 hover:w-full"></span>
        </button>

        {/* Logout as link */}
        <button
          onClick={logout}
          className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
