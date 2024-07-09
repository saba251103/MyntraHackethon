// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import NextPage from './nextpage';

function App() {
  return (
    <Router>
      <div className='App'> 
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/nextpage" element={<NextPage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
