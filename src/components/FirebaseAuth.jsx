import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import winzoprintlogo from './assets/winzoprint logo.jpg'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFTlkZF9kCeMY67cZwicWnYw8vzl02I5k",
  authDomain: "fastprint-b7daf.firebaseapp.com",
  projectId: "fastprint-b7daf",
  storageBucket: "fastprint-b7daf.firebasestorage.app",
  messagingSenderId: "799300538625",
  appId: "1:799300538625:web:2f8216a47b5a4de8818b00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const FirebaseAuth = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      onLogin(result.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <h1 className="text-3xl font-bold mb-6">Login Page</h1>
      {!user ? (
        <button
          onClick={handleSignIn}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg font-bold text-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
        >
          <img
            src={winzoprintlogo}
            alt="React"
            className="w-16 h-16"
          />
          Sign In with Google
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User profile"
              className="w-16 h-16 rounded-full mb-2"
            />
          )}
          <p className="font-semibold text-lg mb-1">{user.displayName}</p>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseAuth;