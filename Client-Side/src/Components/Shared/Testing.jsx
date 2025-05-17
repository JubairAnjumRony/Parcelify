import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaShoppingCart, FaUsers, FaUtensils, FaBars, FaTimes, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import useDeliveryMen from "../hooks/useDeliveryMen";
import { RxAvatar } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";
import { GoCodeReview } from "react-icons/go";
import { useState } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase.config"; // Import your Firebase auth instance

const Dashboard = () => {
  const { user,logOut } = useAuth();
  const [isAdmin] = useAdmin();
  const [isDeliveryMen] = useDeliveryMen();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      // Optional: redirect to login page or handle post-logout logic
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Determine user role for badge
  const getUserRole = () => {
    if (isAdmin) return "Admin";
    if (isDeliveryMen) return "Delivery";
    return "User";
  };

  // Get badge color based on role
  const getBadgeColor = () => {
    switch(getUserRole()) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Delivery": return "bg-blue-100 text-blue-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile menu button */}
      <div className="md:hidden bg-blue-500 p-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-white text-xl font-bold">Dashboard</h1>
      </div>

      {/* dashboard side bar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 w-3/4 sm:w-64 fixed md:static inset-y-0 left-0 z-20
        bg-blue-50 text-blue-900 shadow-lg md:shadow-none
        transition-transform duration-300 ease-in-out flex flex-col md:w-full`}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center p-4 border-b border-blue-200">
          <div className="mb-3 relative">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <span className={`absolute -bottom-2 -right-2 text-xs px-2 py-1 rounded-full ${getBadgeColor()}`}>
              {getUserRole()}
            </span>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">
              {user?.displayName || 'User Name'}
            </h3>
            <p className="text-sm text-blue-700 truncate w-full px-2">
              {user?.email || 'user@example.com'}
            </p>
            <div className="text-xs mt-1 text-gray-500">
              Account: <span className="font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <ul className="menu p-4">
            {isAdmin ? (
              <>
                <li>
                  <NavLink to="/dashboard/statistics" onClick={() => setSidebarOpen(false)}>
                    <FaHome />
                    Statistics
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/allParcel" onClick={() => setSidebarOpen(false)}>
                    <FaUsers />
                    All Parcel
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/allUser" onClick={() => setSidebarOpen(false)}>
                    <FaUsers />
                    All Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/allDeliveryMen" onClick={() => setSidebarOpen(false)}>
                    <FaUsers />
                    All DeliveryMen
                  </NavLink>
                </li>
              </>
            ) : isDeliveryMen ? (
              <>
                <li>
                  <NavLink to="/dashboard/myDelivery" onClick={() => setSidebarOpen(false)}>
                    <TbTruckDelivery className="text-xl" />
                    My Delivery
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/myReviews" onClick={() => setSidebarOpen(false)}>
                    <GoCodeReview className="text-xl" />
                    My Reviews
                  </NavLink>
                </li>
              </>
            ) : user ? (
              <>
                <li>
                  <NavLink to="/dashboard/bookAParcel" onClick={() => setSidebarOpen(false)}>
                    <FaUtensils />
                    Book a Parcel
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/myParcel" onClick={() => setSidebarOpen(false)}>
                    <FaShoppingCart />
                    My Parcel
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Bottom Action Buttons */}
        <div className="border-t border-blue-200 p-4 space-y-2">
          <button
            onClick={() => {
              setSidebarOpen(false);
              // Navigate to profile or handle click
            }}
            className="w-full flex items-center justify-start p-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FaUserCog className="text-blue-600 mr-3" />
            <span>My Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start p-2 rounded-lg hover:bg-blue-100 transition-colors text-red-600"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* dashboard content */}
      <div 
        className={`flex-1 p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'ml-3/4 sm:ml-64' : ''}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;