import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../clientRequest/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function AllProducts() {
  const { user } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Are you sure to remove this item?")) {
      try {
        const res = await removeProduct(slug, user.token);
        loadAllProducts();
        toast.success(`"${res.data.title}" is removed`);
      } catch (err) {
        if (err.response.status === 400) toast.error(err.response.data);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>All Products</h4>
          )}
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 pb-3">
                <AdminProductCard product={product} handleRemove={handleRemove}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};