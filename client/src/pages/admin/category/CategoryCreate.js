import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createCategory, getCategories, removeCategory } from "../../../clientRequest/category";

export default function CategoryCreate() {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCategory({ name }, user.token);
      console.log(res);
      setLoading(false);
      setName("");
      loadCategories();
      toast.success(`"${res.data.name}" is created`);
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response.status === 400) toast.error(err.response.data);
    }
  };

  const handleRemove = async(slug) => {
    if(window.confirm('Are you sure to remove this item?')){
      setLoading(true);
      try {
        const res = await removeCategory(slug, user.token);
        setLoading(false);
        loadCategories();
        toast.success(`"${res.data.name}" is removed`);
      } catch (err) {
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      }
    }
  }

  const categoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          className="form-control"
          value={name}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary" disabled={loading}>
          Save
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create category</h4>
          )}
          {categoryForm()}

          <hr />
          {categories.map((c) => (
            <div className="alert alert-secondary" key={c.id}>
              {c.name}
              <span onClick={()=>{handleRemove(c.slug)}} className="btn btn-sm float-right">
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
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
