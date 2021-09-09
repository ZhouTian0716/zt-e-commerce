import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Cart() {
  // redux state
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const getTotal=()=>{
      return cart.reduce((current, next)=>{
        return current + next.count*next.price
      },0)
  }

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Product</h4>
          {!cart.length ? (
            <h4>
              No product added in cart yet.{" "}
              <Link to="/shop">Continue Shopping</Link>
            </h4>
          ) : (
            <h4>items herer</h4>
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products:</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          <p>Total: <b>${getTotal()}</b></p>
          <hr />
          {user ? (
            <button className="btn btn-sm btn-primary mt-2">
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              Login to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
