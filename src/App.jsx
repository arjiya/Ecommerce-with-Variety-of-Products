import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home/Home';
import CategoryPage from './components/CategoryPage';
import ProductDetail from './components/ProductDetail';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import SearchResults from './components/SearchResults';
import CheckoutPage from './components/CheckoutPage';
import PaymentResponsePage from './components/PaymentResponsePage';
import Dashboard from './components/Dashboard';
import Payment from './components/Payment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
import khaltiConfig from './components/khaltiConfig';
import ReceiptPage from './components/ReceiptPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
// import AdminPanel from './components/AdminPanel';


function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/khaltiConfig" element={<khaltiConfig/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/Login" element={<Login/>} />
      
        {/* <Route path="/search" element={<SearchResults />} /> */}
        <Route path="/CartPage" element={<CartPage/>} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/addToCart" element={<addToCart/>} />
        {/* <Route path="/CheckoutPage" element={<CheckoutPage/>} /> */}
        <Route path="/Profile" element={<Profile/>} />
         <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/AdminDashboard" element={<AdminDashboard/>} />

        {/* <Route path="/PaymentResponsePage" element={<PaymentResponsePage/>} />   */}
      </Routes>
    </Router>
  );
}

export default App;




