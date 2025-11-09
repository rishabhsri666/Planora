import React, { useState } from 'react';
import './Auth.css';
import logo from './assets/planora-logo.png';
import { auth } from './firebase.config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  // Handle Sign Up
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential.user);
      // Redirect or update UI after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      // Redirect or update UI after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 5000);
    } catch (error) {
      console.error('Password reset error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase Auth Errors
  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('This email is already registered.');
        break;
      case 'auth/invalid-email':
        setError('Invalid email address.');
        break;
      case 'auth/user-not-found':
        setError('No account found with this email.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password.');
        break;
      case 'auth/weak-password':
        setError('Password should be at least 6 characters.');
        break;
      case 'auth/too-many-requests':
        setError('Too many attempts. Please try again later.');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection.');
        break;
      default:
        setError('An error occurred. Please try again.');
    }
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  // Toggle between Login and Sign Up
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setResetEmailSent(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo">
          <img src={logo} alt="Planora Logo" className="logo-icon" />
          <h1>Planora</h1>
        </div>
        <p className="tagline">Your AI-Powered Academic Planner.</p>
      </div>

      <div className="auth-card">
        <div className="tab-container">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>

        <h2 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        {!isLogin && <p className="auth-subtitle">Get started with Planora</p>}

        {resetEmailSent && (
          <div className="success-message">
            Password reset email sent! Check your inbox.
          </div>
        )}

        {error && <div className="error-message-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder={isLogin ? 'Enter your email' : 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              {isLogin && (
                <a 
                  href="#" 
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              isLogin ? 'Log In' : 'Sign Up'
            )}
          </button>
        </form>

        {isLogin ? (
          <div className="auth-footer">
            <p className="terms-text">
              By continuing, you agree to our{' '}
              <a href="#">Terms of Service</a> and{' '}
              <a href="#">Privacy Policy</a>.
            </p>
          </div>
        ) : (
          <p className="switch-mode">
            Already have an account?{' '}
            <span onClick={toggleMode} className="link">
              Log In
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;