import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import './App.css';
import { Navbar } from 'react-bootstrap';

function App() {
  return (
    <div>
      <Navbar className='px-3' bg='light' variant='light'>
        <Navbar.Brand as={Link} to={'/'}><b>Form Editor</b></Navbar.Brand>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
