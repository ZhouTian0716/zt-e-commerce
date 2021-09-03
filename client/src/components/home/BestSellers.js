import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../clientRequest/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("sold", "desc", page)
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

    <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
          <Pagination
            current={page}
            total={(productsCount / 3) * 10}
            onChange={(value) => setPage(value)}
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
