import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  clearUserCart,
  saveUserAddress,
  applyCoupon,
} from "../clientRequest/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Checkout({history}) {
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountErr, setDiscountErr] = useState("");

  

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
    dispatch({
      type: "COUPON_APPLIED",
      payload: false,
    });
    // clear backend
    clearUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      // somepage updates
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is empty. Continue shopping.");
    });
  };

  const saveAddressToDb = () => {
    // console.log(address);
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const applyDiscountCoupon = () => {
    console.log("sending coupon to backend", coupon);
    applyCoupon(user.token, coupon).then((res) => {
      console.log("RES ON COUPON APPLIED", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // Push to redux
        dispatch({
          type: "COUPON_APPLIED",
          payload: true, 
        });
      }
      if (res.data.err) {
        setDiscountErr(res.data.err);
        // Push to redux
        dispatch({
          type: "COUPON_APPLIED",
          payload: false, 
        });
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountErr("");
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>
        Apply
      </button>
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountErr && <p className="text-danger p-2">{discountErr}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Total: ${total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}
        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
              onClick={()=>history.push('/payment')}
            >
              Place Order
            </button>
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
