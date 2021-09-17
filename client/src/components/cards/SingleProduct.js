import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import defaultImg from "../../images/laptop.png";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../clientRequest/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";

const { TabPane } = Tabs;

// this is children component of product page
export default function SingleProduct({ product, onStarClick, star }) {
  // local state
  const { title, images, description, _id } = product;
  const [tooltip, setTooltip] = useState("Click to add");
  // redux state
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  // functions
  const handleAddToCart = () => {
    // Disable controll
    if (product.quantity < 1) return;
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log('unique', unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      // show tooltip
      setTooltip("Added");
      // add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((each) => <img src={each.url} key={each.public_id} />)}
          </Carousel>
        ) : (
          <Card
            cover={<img src={defaultImg} className="mb-3 card-img" />}
          ></Card>
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description}
          </TabPane>
          <TabPane tab="More" key="2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            perspiciatis, molestiae numquam sunt enim ducimus itaque dolor?
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a disabled={product.quantity < 1} onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" /> <br />
                {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
              </a>
            </Tooltip>,

            <Link to={`/`}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </Link>,

            <RatingModal>
              {/* Here pass the entire StarRating as children props */}
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="green"
                starDimension="30px"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
}
