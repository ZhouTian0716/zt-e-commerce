// useParams : another method to get slug
// import { useParams } from "react-router-dom";
// let { slug } = useParams();
import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { create } from "../../../clientRequest/product";
import { getProduct } from "../../../clientRequest/product";
import {
  getCategories,
  getSubCategories,
} from "../../../clientRequest/category";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  sub_categories: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

export default function ProductUpdate({ match }) {
  // Redux store state
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);

  const [productState, setProductState] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { slug } = match.params;

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      // console.log("single product", p);
      // 1 load single proudct
      setProductState({ ...productState, ...p.data });
      // 2 load single product category subs
      getSubCategories(p.data.category._id).then((res) => {
        setSubOptions(res.data); // on first load, show default subs
      });
      // 3 prepare array of sub ids to show as default sub values in antd Select
      let arr = [];
      p.data.sub_categories.map((s) => {
        arr.push(s._id);
      });
      console.log("ARR", arr);
      setArrayOfSubs((prev) => arr); // required for ant design select to work
    });
  };

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  useEffect(() => {
    loadProduct();
    loadCategories();
    // console.log(productState.categories)
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await updateCategory(match.params.slug, { name }, user.token);
  //     // console.log(res);
  //     setLoading(false);
  //     setName("");
  //     toast.success(`Changed to "${res.data.name}"`);
  //     history.push("/admin/category");
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err);
  //     if (err.response.status === 400) toast.error(err.response.data);
  //   }
  // };

  const handleSubmit = async (e) => {};

  const handleChange = async (e) => {
    setProductState({ ...productState, [e.target.name]: e.target.value });
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setProductState({ ...productState, subs: [] });

    setSelectedCategory(e.target.value);

    getSubCategories(e.target.value).then((res) => {
      console.log("SUB OPTIONS ON CATGORY CLICK", res);
      setSubOptions(res.data);
    });

    console.log("EXISTING CATEGORY productState.category", productState.category);

    // if user clicks back to the original category
    // show its sub categories in default
    if (productState.category._id === e.target.value) {
      loadProduct();
    }
    // clear old sub category ids
    setArrayOfSubs([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Update</h4>
          {/* {JSON.stringify(productState)} */}

          <hr />

          <ProductUpdateForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCatagoryChange={handleCatagoryChange}
            productState={productState}
            setProductState={setProductState}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
