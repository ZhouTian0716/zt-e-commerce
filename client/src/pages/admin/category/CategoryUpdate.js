import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getCategory,
  updateCategory,
} from "../../../clientRequest/category";

export default function CategoryUpdate( {history, match} ) {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);



  const loadCategory = () =>
    getCategory(match.params.slug).then((c) => setName(c.data.name));

  useEffect(() => {
    loadCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateCategory(match.params.slug, { name }, user.token);
      console.log(res);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is updated`);
      history.push('/admin/category')
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response.status === 400) toast.error(err.response.data);
    }
  };



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
            <h4>Edit category</h4>
          )}
          {categoryForm()}

          <hr />
         
        </div>
      </div>
    </div>
  );
}
