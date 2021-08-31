import React, { useEffect, useState } from "react";
import { getProductsByCount } from "../clientRequest/product";
import AdminProductCard from "../components/cards/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadAllProducts();
  }, []);
  

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(3)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };


  return (
    <div className="jumbotron">

    </div>
  );
};

export default Home;
