import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const BurgerMenu = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
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
            <Link to='/'>Login</Link>
            <Link to='/calendar'>Calendário</Link>
        </ul>
      </nav>
    </div>
  );
};

export default BurgerMenu;
