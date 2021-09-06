import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAll } from "../../clientRequest/subCategory";

export default function SubCategoryTags() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAll().then((res) => {
      setSubCategories(res.data);
      setLoading(false);
    });
  }, []);

  const showSubCategories = () =>
  subCategories.map((s) => (
      <div
        key={s._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link to={`/sub-category/${s.slug}`}>{s.name}</Link>
      </div>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
            showSubCategories()
        )}
      </div>
    </div>
  );
}
