

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home/Home';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Footer from './components/Footer';




function App() {
  return (
    <Router>
      <Routes> 
        
        <Route path="/" element={<Home />} />
         <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Register" element={<Register/>} />
   
      </Routes>
      <Footer /> 
    </Router>
  );
}

export default App;




