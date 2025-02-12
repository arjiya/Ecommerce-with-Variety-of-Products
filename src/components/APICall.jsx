
// import React, { useEffect, useState } from 'react';
// import './APICall.css'; 

// function APICall() {
//     const [product, setProduct] = useState([]);

//     useEffect(() => {
//         fetch('https://fakestoreapi.com/products')
//             .then(res => res.json())
//             .then(prod => setProduct(prod))
//             .catch(err => console.log("Error fetching data:", err));
//     }, []);
//     console.log(product)

//     return (
//       <div className='api'>
//         <div className="api-container">
//             <h1>Our Products</h1>
//             <div className="product-grid">
//                 {product.map((item) => (
//                     <div className="product-card" key={item.id}>
//                         <img className="product-image" src={item.image} alt={item.title} />
//                         <div className="product-info">
//                             <div className="font-bold text-xl mb-2">{item.title}</div>
//                         </div>
//                         <div className="product-stats">
//                             <span className="price">Price: ${item.price}</span>
//                             <span className="rating">Rating: {item.rating.count}</span>
//                             <span className="availability">Available: {item.rating.count}</span>
//                             <span className="category">Category: {item.category}</span>
                           
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//         </div>
//     );
// }

// export default APICall;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './APICall.css'; 

function APICall() {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(prod => setProduct(prod))
            .catch(err => console.log("Error fetching data:", err));
    }, []);

    return (
        <div className='api'>
            <div className="api-container">
                <h1>Our Products</h1>
                <div className="product-grid">
                    {product.map((item) => (
                        <div className="product-card" key={item.id}>
                            <Link to={`/product/${item.id}`}>  {/* Link to product detail page */}
                                <img className="product-image" src={item.image} alt={item.title} />
                            </Link>
                            <div className="product-info">
                                <div className="font-bold text-xl mb-2">{item.title}</div>
                            </div>
                            <div className="product-stats">
                                <span className="price">Price: ${item.price}</span>
                                <span className="category">Category: {item.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default APICall;
