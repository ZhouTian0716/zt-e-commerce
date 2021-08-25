import React from "react";

export default function CategoryForm({handleSubmit, name, setName, loading}) {
  return (
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
}
