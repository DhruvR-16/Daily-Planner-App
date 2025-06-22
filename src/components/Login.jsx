import React, { useState } from "react";
import { auth } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import '../components/LoginStyles.css';

function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[^a-zA-Z\d]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handlePasswordChange = (password) => {
    setSignupPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const validateForm = (isSignup = false) => {
    const errors = {};

    if (isSignup) {
      if (!username.trim()) {
        errors.username = "Username is required";
      }

      if (!validateEmail(signupEmail)) {
        errors.signupEmail = "Please enter a valid email address";
      }

      if (signupPassword.length < 6) {
        errors.signupPassword = "Password must be at least 6 characters";
      }

      if (signupPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    } else {
      if (!validateEmail(loginEmail)) {
        errors.loginEmail = "Please enter a valid email address";
      }

      if (!loginPassword) {
        errors.loginPassword = "Password is required";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm(false)) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      const user = userCredential.user;
      const displayName = user.displayName || user.email.split("@")[0];
      onLogin({ username: displayName });
    } catch (error) {
      let errorMessage = "Login failed";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password sign-in is not enabled. Please contact administrator.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm(true)) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      onLogin({ username: username });
    } catch (error) {
      let errorMessage = "Signup failed";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password sign-up is not enabled. Please contact administrator.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score <= 1) return 'var(--error-500)';
    if (score <= 2) return 'var(--warning-500)';
    if (score <= 3) return 'var(--warning-400)';
    if (score <= 4) return 'var(--success-400)';
    return 'var(--success-500)';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <CheckCircle size={32} />
            </div>
            <h1 className="logo-text">PlanX</h1>
          </div>
          <p className="login-subtitle">Your daily planning assistant</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError("");
              setFieldErrors({});
            }}
          >
            Sign In
          </button>
          <button
            className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError("");
              setFieldErrors({});
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`form-input ${fieldErrors.loginEmail ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {fieldErrors.loginEmail && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.loginEmail}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="login-password"
                  name="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`form-input ${fieldErrors.loginPassword ? 'error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.loginPassword && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.loginPassword}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading && (
                <div className="loading-spinner"></div>
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                  placeholder="Choose a username"
                />
              </div>
              {fieldErrors.username && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.username}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="signup-email"
                  name="signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className={`form-input ${fieldErrors.signupEmail ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {fieldErrors.signupEmail && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.signupEmail}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="signup-password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="signup-password"
                  name="signup-password"
                  type={showSignupPassword ? "text" : "password"}
                  required
                  value={signupPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`form-input ${fieldErrors.signupPassword ? 'error' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.signupPassword && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.signupPassword}</span>
                </div>
              )}
              
              {signupPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(passwordStrength.score)
                      }}
                    ></div>
                  </div>
                  <div className="strength-text">
                    <span style={{ color: getPasswordStrengthColor(passwordStrength.score) }}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="strength-feedback">
                        Missing: {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>{fieldErrors.confirmPassword}</span>
                </div>
              )}
              {confirmPassword && signupPassword && confirmPassword === signupPassword && (
                <div className="field-success">
                  <CheckCircle size={14} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading && (
                <div className="loading-spinner"></div>
              )}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;