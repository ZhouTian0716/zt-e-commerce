import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userCart } from "../clientRequest/user";
import ProductRowInCheckout from "../components/cards/ProductRowInCheckout";

export default function Cart({ history }) {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const getTotal = () => {
    return cart.reduce((current, next) => {
      return current + next.count * next.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        // console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  };

  const saveCashOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        // console.log("CART POST RES", res);
        dispatch({
          type:"SET_COD",
          payload:true
        });
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      {cart.map((p) => (
        <ProductRowInCheckout key={p._id} p={p} />
      ))}
    </table>
  );

  const productText = cart.length > 1 ? "Products" : "Product";

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>
            Cart / {cart.length} {productText}
          </h4>
          {!cart.length ? (
            <p>
              No product added in cart yet.{" "}
              <Link to="/shop">Continue Shopping</Link>
            </p>
          ) : (
            showCartItems()
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
          <p>
            Total: <b>${getTotal()}</b>
          </p>
          <hr />
          {user ? (
            <>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={saveOrderToDb}
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                className="btn btn-sm btn-warning mt-2"
                onClick={saveCashOrderToDb}
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <Link
              to={{
                pathname: "/login",
                state: { from: "/cart" },
              }}
            >
              <button className="btn btn-sm btn-primary mt-2">
                {/* refer to LoginRedirect in Login.js */}
                Login to Checkout
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
