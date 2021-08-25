import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { create, getAll, remove } from "../../../clientRequest/subCategory";
import { getCategories } from "../../../clientRequest/category";
// Reusable component
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

export default function SubCategoryCreate() {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  // Searching
  const [keyword, setKeyword] = useState("");

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubCategories = () =>
    getAll().then((c) => setSubCategories(c.data));

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await create({ name, parent: category }, user.token);
      setLoading(false);
      setName("");
      loadCategories();
      loadSubCategories();
      toast.success(`"${res.data.name}" is created`);
    } catch (err) {
      setLoading(false);
      if (err.response.status === 400) toast.error(err.response.data.name);
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Are you sure to remove this item?")) {
      setLoading(true);
      try {
        const res = await remove(slug, user.token);
        setLoading(false);
        loadCategories();
        loadSubCategories();
        toast.success(`Sub Category ${res.data.name} removed`);
      } catch (err) {
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data.name);
      }
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Create Sub Category</h4>

          <div className="form-group">
            <label>Under category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
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

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          <hr />
          {subCategories.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}
              <span
                onClick={() => {
                  handleRemove(s.slug);
                }}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/sub-category/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
