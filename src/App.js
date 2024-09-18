import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import NextPage from './nextpage';
import Colortest from './colortest';
import ColorRecommendation from './color';
import backgroundImage from './background.png' 

function App() {
  return (
    <Router>
      <div 
        className='App' 
        style={{
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          minHeight: '100vh' // Ensures the background covers the whole viewport
        }}
      > 
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/nextpage" element={<NextPage />} />
          <Route path="/colortest" element={<Colortest />} />
          <Route path="/color" element={<ColorRecommendation />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
