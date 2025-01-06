import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import "./CategorySelector.css";

function CategorySelector({ onCategorySelect }) {
  const { api } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-categories/");
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategory(""); // Reset subcategory when category changes

    // Find the selected category and notify parent component
    const category = categories.find((cat) => cat.id === categoryId);
    onCategorySelect({
      categoryId: categoryId,
      subcategoryId: null,
      categoryName: category?.name,
    });
  };

  const handleSubcategoryChange = (event) => {
    const subcategoryId = event.target.value;
    setSelectedSubcategory(subcategoryId);

    // Find the selected category and subcategory
    const category = categories.find((cat) => cat.id === selectedCategory);
    const subcategory = category?.subcategories?.find(
      (sub) => sub.id === subcategoryId
    );

    onCategorySelect({
      categoryId: selectedCategory,
      subcategoryId: subcategoryId,
      categoryName: category?.name,
      subcategoryName: subcategory?.name,
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} sx={{ color: "#09B1BA" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <Box className="category-selector">
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Catégorie"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCategory && selectedCategoryData?.subcategories?.length > 0 && (
        <FormControl fullWidth>
          <InputLabel>Sous-catégorie</InputLabel>
          <Select
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            label="Sous-catégorie"
          >
            {selectedCategoryData.subcategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

export default CategorySelector;
