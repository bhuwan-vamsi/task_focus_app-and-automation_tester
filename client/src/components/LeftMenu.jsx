import React, { useState } from "react";
import "../styles/LeftMenu.css";

export default function LeftMenu({ categories, onCategorySelect, onAddCategory }) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
      setNewCategory("");
    }
  };

  return (
    <div
      className="bg-light border-end p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
        overflowY: "auto", // Enable scrolling for LeftMenu
      }}
    >
      <h5>Categories</h5>
      <ul className="list-unstyled">
        {categories.map((category) => (
          <li
            key={category}
            className="py-2 px-3 rounded"
            style={{ cursor: "pointer" }}
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="btn btn-outline-success w-100"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>
    </div>
  );
}
