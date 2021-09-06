import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryTags from "../components/home/CategoryTags";
import SubCategoryTags from "../components/home/SubCategoryTags";


const Home = () => {


  return (
    <>
      <div className="jumbotron text-danger h1 font-weight-bold text-center">
        <Jumbotron
          textArray={["Latest Products", "NewArrivals", "Best Sellers"]}
        />
      </div>

      

      <NewArrivals />

      <BestSellers />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Categories
      </h4>
      <CategoryTags />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Sub Categories
      </h4>
      <SubCategoryTags />

      <br />
    </>
  );
};

export default Home;
