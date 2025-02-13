import React from 'react'
import APICall from '../components/APICall'
import Header from '../components/Header'
import ProductDetail from '../components/ProductDetail'
import HomePage from '../components/HomePage'

const Home = () => {
  return (
    <div>
      <Header />
      <HomePage/>
      <APICall />
     
    </div>
  )
}

export default Home




