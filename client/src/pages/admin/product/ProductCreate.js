import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { create } from "../../../clientRequest/product";
import {
  getCategories,
  getSubCategories,
} from "../../../clientRequest/category";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  sub_categories: [],
  shipping: "Yes",
  quantity: "20",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

export default function ProductCreate() {
  // Redux store state
  const { user } = useSelector((state) => ({ ...state }));
  const [productState, setProductState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);

  const loadCategories = () =>
    getCategories().then((c) =>
      setProductState({ ...productState, categories: c.data })
    );

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await create(productState, user.token);
      console.log(res);
      window.alert(`"${res.data.title}" is created`);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.log(err);
      // if (err.response.status === 400) toast.error(err.response.data);
      toast.error(err.response.data.err);
    }
  };

  const handleChange = async (e) => {
    // special syntax of setState
    setProductState({ ...productState, [e.target.name]: e.target.value });
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setProductState({
      ...productState,
      sub_categories: [],
      category: e.target.value,
    });
    getSubCategories(e.target.value)
      .then((res) => {
        console.log("SUB OPTIONS ON CATGORY CLICK", res);
        setSubOptions(res.data);
      })
      .then(() => setShowSub(true));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product Create</h4>
          )}
          <hr />

          <div className="p-3">
            <FileUpload
              productState={productState}
              setProductState={setProductState}
              setLoading={setLoading}
            />
          </div>

          <ProductCreateForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCatagoryChange={handleCatagoryChange}
            productState={productState}
            setProductState={setProductState}
            loading={loading}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
}
