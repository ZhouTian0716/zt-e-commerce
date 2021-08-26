import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { create } from "../../../clientRequest/product";

const initialState = {
  title: "ThinkPad",
  description: "Popular and Reliable",
  price: "2000",
  categories: [],
  category: "",
  sub_categories: [],
  shipping: "Yes",
  quantity: "50",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "Black",
  brand: "Lenovo",
};

export default function ProductCreate() {
  // Redux store state
  const { user } = useSelector((state) => ({ ...state }));
  const [productState, setProductState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  // destructure
  const {
    title,
    description,
    price,
    categories,
    category,
    sub_categories,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = productState;

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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Create</h4>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Shipping</label>
              <select
                name="shipping"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <select
                name="color"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <select
                name="brand"
                className="form-control"
                onChange={handleChange}
              >
                <option>Please Select</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-outline-info" disabled={loading}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
