import React, { useEffect, useState } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../clientRequest/product";
import { getCategories } from "../clientRequest/category";
import { getAll } from "../clientRequest/subCategory";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";
const { SubMenu, ItemGroup } = Menu;

export default function Shop() {
  const [ok, setOk] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [sub, setSub] = useState("");
  const [star, setStar] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    loadProducts();
    getCategories().then((res) => {
      setCategories(res.data);
    });
    getAll().then((res) => {
      setSubCategories(res.data);
    });
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  // 1. load products by default on page load
  const loadProducts = () => {
    setLoading(true);
    getProductsByCount(20).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  // 2. load products on user search keyword
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 600);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products on price range
  useEffect(() => {
    console.log("ok to request on price range");
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });

    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    setSub("");
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. filter products on category
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleCheck = (e) => {
    // Some Resets
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setBrand("");
    setColor("");
    setShipping("");
    setStar("");
    setSub("");
    // Dealing with the checked options
    let storedOptions = [...categoryIds];
    let targetIndex = storedOptions.indexOf(e.target.value);
    if (targetIndex === -1) {
      storedOptions.push(e.target.value);
    } else {
      storedOptions.splice(targetIndex, 1);
    }
    setCategoryIds(storedOptions);
    fetchProducts({ category: storedOptions });
  };

  // 5. filter products on category
  const handleStarClick = (num) => {
    // Some Resets
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub("");
    setColor("");
    setBrand("");
    setShipping("");
    setStar(num);
    fetchProducts({ stars: num });
    //
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  // 6 sub category
  const showSubCategories = () =>
    subCategories.map((s) => (
      <div
        className="p-1 m-1 badge badge-secondary"
        key={s._id}
        onClick={() => handleSub(s)}
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    ));

  const handleSub = (sub) => {
    // Some Resets
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setColor("");
    setShipping("");
    setBrand("");
    setSub(sub);
    fetchProducts({ sub_category: sub });
  };

  // 7. Brand
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        className="pb-1 pl-1 pr-4"
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setColor("");
    setShipping("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  //8. colors
  const showColors = () =>
    colors.map((c) => (
      <Radio
        className="pb-1 pl-1 pr-4"
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setShipping('');
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  //9. shipping
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingchange = (e) => {
    setSub("");
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>

            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Category Options
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showCategories()}</div>
            </SubMenu>

            {/* stars section*/}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }}>{showStars()}</div>
            </SubMenu>

            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-3 pr-5">
                {showSubCategories()}
              </div>
            </SubMenu>

            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-3 pr-5">
                {showBrands()}
              </div>
            </SubMenu>

            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-3 pr-5">
                {showColors()}
              </div>
            </SubMenu>

            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ marginTop: "-10px" }} className="pl-3 pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3 mb-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
