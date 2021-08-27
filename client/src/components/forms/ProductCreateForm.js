import React from "react";
import { Select } from "antd";
const { Option } = Select;

export default function ProductCreateForm({
  handleChange,
  handleSubmit,
  handleCatagoryChange,
  productState,
  setProductState,
  loading,
  subOptions,
  showSub,
}) {
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

  return (
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
        <select name="color" className="form-control" onChange={handleChange}>
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
        <select name="brand" className="form-control" onChange={handleChange}>
          <option>Please Select</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          onChange={handleCatagoryChange}
        >
          <option>Please Select</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {showSub && (
        <div className="form-group">
          <label>Sub Category</label>
          <Select
            
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Please select"
            value={sub_categories}
            onChange={(value) =>
              setProductState({ ...productState, sub_categories: value })
            }
          >
            {subOptions.length > 0 &&
              subOptions.map((opt) => (
                <Option key={opt._id} value={opt._id}>
                  {opt.name}
                </Option>
              ))}
          </Select>
        </div>
      )}

      <button className="btn btn-outline-info" disabled={loading}>
        Save
      </button>
    </form>
  );
}
