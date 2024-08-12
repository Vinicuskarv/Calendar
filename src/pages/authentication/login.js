import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import NavBar from '../../components/navbar'; // Corrija o caminho se necessário

const firebaseConfig = {
  apiKey: "AIzaSyBElUcnWWCJIHYodXTaFULLi0-mavyZPR8",
  authDomain: "calendar-d1ee6.firebaseapp.com",
  projectId: "calendar-d1ee6",
  storageBucket: "calendar-d1ee6.appspot.com",
  messagingSenderId: "212205682130",
  appId: "1:212205682130:web:f8c9de724d70046bee5c0b",
  measurementId: "G-K26FJ2TK9M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Implement getEvents if needed
        // getEvents(currentUser.uid);  
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User Info:', result.user);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out.');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  useEffect(() => {
    if (user) {
      // Implement saveEvents if needed
      // saveEvents();
    }
  }, [user]);

  return (
    <>
      <NavBar />
      <div className='body'>
        <header>
          <h1>Calendar App</h1>
          {user ? (
            <div>
              <p>Welcome, {user.displayName}!</p>
              <button onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <button onClick={handleLogin}>Sign In with Google</button>
          )}
        </header>
      </div>
    </>
  );
}

export default Login;
