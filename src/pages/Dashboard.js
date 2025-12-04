import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  async function logout() {
    await auth.signOut();
    navigate("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-palms">
      <h1 className="text-4xl font-bold mb-4">Welcome to Palms Estate</h1>
      <button
        onClick={logout}
        className="bg-red-600 text-white rounded px-5 py-2 mt-4"
      >
        Log out
      </button>
    </div>
  );
}
