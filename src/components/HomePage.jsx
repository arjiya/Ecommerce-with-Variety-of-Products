import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";  


import MainBannerImage1 from "../assets/images/ec3.jpg"; 
import MainBannerImage2 from "../assets/images/ec1.jpg"; 
import MainBannerImage3 from "../assets/images/ec2.jpg"; 


const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [MainBannerImage1, MainBannerImage2, MainBannerImage3];

 
  const nextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

 
  const prevImage = () => {
    setCurrentImage((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div>
      <header className="main-banner">
      
        <img
          src={images[currentImage]}  
          alt={`ShopNest Banner ${currentImage + 1}`}
          className="banner-image"
        />

        <button className="arrow-button left" onClick={prevImage}>←</button>
        <button className="arrow-button right" onClick={nextImage}>→</button>
      </header>

      <div className="content">
        <h2>Featured Products</h2>
       
      </div>
    </div>
  );
};

export default HomePage;
