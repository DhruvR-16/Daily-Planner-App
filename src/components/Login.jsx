import React, { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || user.email.split("@")[0];
        onLogin({ username: displayName });
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      setError("Please enter your name");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        

        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
        

        await userCredential.user.reload();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Authentication error:", error.code);
      

      if (error.code.includes("auth/")) {
        switch (error.code) {
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("Invalid email or password");
            break;
          case "auth/email-already-in-use":
            setError("Email is already in use");
            break;
          case "auth/weak-password":
            setError("Password should be at least 6 characters");
            break;
          default:
            setError("Authentication failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">PlanX</span>
          </h1>
          <p className="mt-2 text-gray-600">Your daily planning assistant</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isSignUp ? "Create Account" : "Login"}
            </h2>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required={isSignUp}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-70"
            >
              {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
        
       
      </div>
    </div>
  );
};

export default Login;