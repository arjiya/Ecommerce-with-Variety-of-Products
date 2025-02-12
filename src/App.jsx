

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home/Home';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';


function App() {
  return (
    <Router>
      <Routes> 
        
        <Route path="/" element={<Home />} /> 
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;




