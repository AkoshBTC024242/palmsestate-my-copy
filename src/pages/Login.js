import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-palms">
      <h1 className="text-4xl font-bold mb-4">Sign in to Palms Estate</h1>
      <div className="bg-white rounded shadow p-6 w-full max-w-sm">
        <button
          onClick={signInWithGoogle}
          className="w-full mb-4 py-2 bg-green-600 text-white rounded"
        >
          Sign in with Google
        </button>
        <form onSubmit={signInWithEmail} className="flex flex-col gap-2">
          <input
            type="email"
            className="p-2 border rounded"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="p-2 border rounded"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-green-700 text-white py-2 rounded mt-2"
            type="submit"
          >
            Sign in with Email
          </button>
        </form>
        {err && <div className="text-red-600 mt-2">{err}</div>}
      </div>
    </div>
  );
}