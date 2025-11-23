// frontend/src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    dispatch(logout());
    nav("/login");
  }, [dispatch, nav]);
  return <div className="p-6">Logging out…</div>;
}
