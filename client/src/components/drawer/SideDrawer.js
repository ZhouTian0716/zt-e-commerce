import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import defaultImg from "../../images/default.jpg";

export default function SideDrawer() {
  let dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  const productText = cart.length > 0 ? "Products" : "Product";

  const imageStyle = {
    width: "100%",
    height: "130px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} ${productText}`}
      visible={drawer}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <img src={p.images[0].url} style={imageStyle} />
            ) : (
              <img src={defaultImg} style={imageStyle} />
            )}
            <p className="text-center bg-secondary text-light">
              {p.title} x {p.count}
            </p>
          </div>
        </div>
      ))}

      <Link to="/cart">
        <button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go to Cart
        </button>
      </Link>
    </Drawer>
  );
}
