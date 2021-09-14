import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../clientRequest/category";
// Reusable component
import CategoryForm from "../../../components/forms/CategoryForm";

export default function CategoryUpdate({ history, match }) {
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
      // console.log(res);
      setLoading(false);
      setName("");
      toast.success(`Changed to "${res.data.name}"`);
      history.push("/admin/category");
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
        <div className="col-md-10">
          <h4>Edit category</h4>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            loading={loading}
          />

          <hr />
        </div>
      </div>
    </div>
  );
}
