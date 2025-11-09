import React, { useState, useEffect } from 'react';
import './Settings.css';
import { auth, db } from './firebase.config';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const navigate = useNavigate();
  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      setEmail(user.email);
      setResetEmail(user.email);

      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFullName(userData.fullName || '');
        setIsFirstTime(!userData.fullName); // First time if no name set
      } else {
        // User document doesn't exist, this is first time
        setIsFirstTime(true);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  // Handle saving user profile
  const handleSaveChanges = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      const userData = {
        fullName: fullName.trim(),
        email: user.email,
        updatedAt: new Date().toISOString()
      };

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, userData);
      } else {
        // Create new document
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date().toISOString()
        });
      }

      setSuccess('Changes saved successfully!');
      setIsFirstTime(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving changes:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    setSendingReset(true);
    setSuccess('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess('Password reset email sent! Check your inbox.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error sending password reset:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setSendingReset(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to login page or handle navigation
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="settings-loading">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <button onClick={handleLogout} className="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log Out
        </button>
        <button onClick={()=>navigate('/dashboard')} className="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Dashboard
        </button>
      </div>

      <div className="settings-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-avatar">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="profile-info">
            <h2>{fullName || 'New User'}</h2>
            <p>{email}</p>
          </div>
        </div>

        <div className="divider"></div>

        {/* Success/Error Messages */}
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Personal Information Section */}
        <div className="settings-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder={isFirstTime ? "Enter your full name" : "Alex Johnson"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="settings-section">
          <h3>Password</h3>
          
          <div className="form-group">
            <label htmlFor="resetEmail">Enter Email to Reset Password</label>
            <input
              type="email"
              id="resetEmail"
              placeholder="Enter your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>

          <button 
            onClick={handlePasswordReset} 
            className="reset-password-btn"
            disabled={sendingReset}
          >
            {sendingReset ? (
              <>
                <span className="loading-spinner-small"></span>
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </div>

        <div className="divider"></div>

        {/* Save Changes Button */}
        <div className="settings-footer">
          <button 
            onClick={handleSaveChanges} 
            className="save-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="loading-spinner-small"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;