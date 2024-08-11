import Calendar from './pages/calendar';
import Login from './pages/authentication/login';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/calendar' element={<Calendar/>}/>
          </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;