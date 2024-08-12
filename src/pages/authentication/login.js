import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import NavBar from '../../components/navbar';
import './authentication.css';

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
const db = getFirestore(app);

function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data if needed
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Save user additional data to Firestore
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email: email || user.email,
          name: name || user.displayName,
          contact: contact || ''
        });
        console.log('User Info saved to Firestore:', user);
      }
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

  return (
    <>
      <NavBar />
      <div className='body'>
        <div className="container-form">
          {user ? (
            <div>
                <h1>Calendar App</h1>

              <p>Welcome, {user.displayName}!</p>
              <button className='btn' onClick={handleLogout}>Sair</button>
            </div>
          ) : (
            <div className="form-input">
            <h1>Login</h1>
                <div className="coolinput">
                    <label className="text">Nome</label>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="coolinput">
                    <label className="text">Email</label>
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="coolinput">
                    <label className="text">Contacto</label>
                    <input
                        className="input"
                        type="text"
                        placeholder="Contacto"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                </div>

                <br/>
                <hr/>
                <br/>

                <button className='btn' onClick={handleLogin}>Login com o Google</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
