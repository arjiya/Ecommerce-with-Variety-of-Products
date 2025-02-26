import React from 'react'
import APICall from '../components/APICall'
import Header from '../components/Header'
import ProductDetail from '../components/ProductDetail'
import HomePage from '../components/HomePage'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
    <div>
      <Header />
      <HomePage/>
      <APICall />
     
    </div>
    <Footer/>
    </>
  )
}

export default Home




