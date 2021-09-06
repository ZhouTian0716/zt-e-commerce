import React from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import defaultImg from "../../images/laptop.png";
import ProductListItems from "./ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../clientRequest/rating";

const { TabPane } = Tabs;

// this is children component of product page
export default function SingleProduct({ product, onStarClick, star }) {
  const { title, images, description, _id } = product;

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
            <>
              <ShoppingCartOutlined className="text-success" /> <br /> Add to
              Cart
            </>,

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
