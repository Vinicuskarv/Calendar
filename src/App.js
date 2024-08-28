import Calendar from './pages/calendar';
import Login from './pages/authentication/login';
import Admin from './pages/admin/admin';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/calendar' element={<Calendar/>}/>
            <Route path='/admin' element={<Admin/>}/>

          </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;