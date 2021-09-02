import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";

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

      <br />
    </>
  );
};

export default Home;
