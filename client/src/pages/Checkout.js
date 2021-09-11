import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart, clearUserCart } from "../clientRequest/user";
import { toast } from "react-toastify";

export default function Checkout() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      // console.log('user cart res', JSON.stringify(res.data, null, 2));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const clearCart = () => {
    // clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // clear redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // clear backend
    clearUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.success("Cart is empty. Continue shopping.");
    });
  };

  const saveAddressToDb = () => {
    //
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        textarea
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
        <h4>Got Coupon?</h4>
        <br />
        coupon input and apply button
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) x {p.count} ={" "}
              {p.product.price * p.count}
            </p>
          </div>
        ))}
        <hr />
        <p>Cart Total: {total}</p>
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary">Place Order</button>
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={clearCart}
              className="btn btn-primary"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
