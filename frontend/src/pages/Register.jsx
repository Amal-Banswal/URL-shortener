import React, { useState } from "react";
import { register } from "../api";
import { useDispatch } from "react-redux";
import { setAuth } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(email, password);
      dispatch(setAuth({ token: res.data.token, user: res.data.user }));
      nav("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.error || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Create Account
        </button>
      </form>
    </div>
  );
}
