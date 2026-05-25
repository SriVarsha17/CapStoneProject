import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { navbarClass, navContainerClass, navLinksClass, navLinkClass, navLinkActiveClass } from "../styles/common";
import AuthContext from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={navbarClass}>
      <div className={navContainerClass}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="data:image/png;base64,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"
            alt="logo"
            className="h-10 w-10 rounded-lg border border-indigo-200 bg-indigo-50"
          />
          <h1 className="text-lg font-bold tracking-tight text-indigo-900">Blog App</h1>
        </div>

        {/* Navigation */}
        <div className={navLinksClass}>

          {!isAuthenticated && (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
              >
                Login
              </NavLink>
            </>
          )}

          {isAuthenticated && currentUser?.role === 'author' && (
            <NavLink
              to="/author-dashboard"
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Home
            </NavLink>
          )}

          {isAuthenticated && currentUser?.role === 'author' && (
            <NavLink
              to="/addarticle"
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Add Article
            </NavLink>
          )}

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Logout
            </button>
          )}

        </div>
      </div>

      {isAuthenticated && currentUser && (
        <div className="border-t border-indigo-100 bg-indigo-50/70 px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <img
              src={currentUser.profileImage || currentUser.profileImageUrl || 'https://via.placeholder.com/48'}
              alt="Profile"
              className="h-10 w-10 rounded-full border border-slate-300 object-cover"
            />
            <p className="text-sm font-medium text-slate-700">
              Welcome, {currentUser.firstName || 'User'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;