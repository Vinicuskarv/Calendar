import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link } from 'react-router-dom';
import './navbar.css';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBElUcnWWCJIHYodXTaFULLi0-mavyZPR8",
  authDomain: "calendar-d1ee6.firebaseapp.com",
  projectId: "calendar-d1ee6",
  storageBucket: "calendar-d1ee6.appspot.com",
  messagingSenderId: "212205682130",
  appId: "1:212205682130:web:f8c9de724d70046bee5c0b",
  measurementId: "G-K26FJ2TK9M"
};

// Inicializa o Firebase e o Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const BurgerMenu = () => {
  const [user, setUser] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    // Monitorar o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Limpar a assinatura ao desmontar o componente
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out.');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <>
      <div className='container-navbar'>
        <label className="burger" htmlFor="burger">
          <input
            type="checkbox"
            id="burger"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav className={`navbar ${isChecked ? 'active' : ''}`}>
          <ul>
            <Link to='/calendar'>Calendário</Link>
            <Link to='/calendar'>Perfil</Link>
            <Link to='/calendar'>Configuração</Link>
            <Link to='/admin'>Admin</Link>

          </ul>
        </nav>
      </div>
      <div className='container-navbar-right'>
          {user ? (
            <div>
              <Link to='/'><p>{user.displayName || 'User'}</p></Link>
            </div>
          ) : (
            <div>
              <Link to='/'><p>Login</p></Link>
            </div>
          )}
      </div>
    </>
  );
};

export default BurgerMenu;
