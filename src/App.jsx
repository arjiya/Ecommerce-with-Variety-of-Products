

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home/Home';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';


function App() {
  return (
    <Router>
      <Routes> 
        
        <Route path="/" element={<Home />} /> 
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        {/* <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} /> */}
      </Routes>
    </Router>
  );
}

export default App;




