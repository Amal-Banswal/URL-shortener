// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateLink from "./pages/CreateLink";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { logout as logoutAction } from "./slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo + title */}
          <Link to="/" className="flex items-center space-x-3">
            {/* 
              Use the generated favicon (serves from /favicon.png).
              If you want to use the uploaded test image instead, uncomment the alternate src line below.
            */}
            <img
              src="/favicon.png"
              // alt should describe the image for accessibility; site title also exists so we keep it concise
              alt="URL Shortener logo"
              className="h-10 w-10 rounded-lg shadow-sm object-cover"
              style={{ borderRadius: 12 }}
              aria-hidden="false"
            />

            {/*
            // Alternate: use the uploaded image directly (for quick local testing)
            <img
              src="/mnt/data/ff63d2fa-5290-48b0-ad64-ea23ffa63a5d.png"
              alt="URL Shortener logo"
              className="h-10 w-10 rounded-lg shadow-sm object-cover"
              style={{ borderRadius: 12 }}
            />
            */}
            <span className="font-bold text-lg">URL Shortener</span>
          </Link>

          <div className="flex items-center space-x-4">
            {auth.token ? (
              <>
                <Link to="/create" className="text-blue-600">
                  Create
                </Link>
                <Link to="/dashboard" className="text-blue-600">
                  Dashboard
                </Link>
                {auth.user?.email && (
                  <span className="text-sm text-gray-600">Hi, {auth.user.email}</span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CreateLink />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
