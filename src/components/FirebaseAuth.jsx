import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


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
      onLogin(result.user); // Call the onLogin prop with the user data
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Signed in as: {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
};

export default FirebaseAuth;