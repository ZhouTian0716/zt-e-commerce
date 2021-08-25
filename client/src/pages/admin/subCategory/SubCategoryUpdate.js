import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategories } from "../../../clientRequest/category";
import { getOne, update } from "../../../clientRequest/subCategory";
// Reusable component
import CategoryForm from "../../../components/forms/CategoryForm";

export default function SubCategoryUpdate({ history, match }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubCategory = () =>
    getOne(match.params.slug).then((s) => {
      setName(s.data.name);
      setParent(s.data.parent);
    });

  useEffect(() => {
    loadCategories();
    loadSubCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await update(match.params.slug, { name, parent }, user.token);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is updated`);
      history.push("/admin/sub-category");
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response.status === 400) toast.error(err.response.data);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Edit Sub Category</h4>

          <div className="form-group">
            <label>Under category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option>Please Select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id} selected={c._id === parent}>
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
        </div>
      </div>
    </div>
  );
}
