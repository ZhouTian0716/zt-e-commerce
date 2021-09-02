import React, { useEffect, useState } from "react";
import { getProducts } from "../../clientRequest/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("sold", "desc", 3)
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
    <>
    <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
      Best Sellers
    </h4>
    <div className="container">
      {loading ? (
        <LoadingCard count={3} />
      ) : (
        <div className="row">
          {products.map((p) => (
            <div key={p._id} className="col-md-4 pb-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BestSellers;
