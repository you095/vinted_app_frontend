import React, { useState } from "react";
import { Container, Typography, Paper, TextField, Button } from "@mui/material";
import CategorySelector from "../components/CategorySelector/CategorySelector";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import { useAuth } from "../contexts/AuthContext";
import "./Sell.css";

function Sell() {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    size: "",
    condition: "",
    color: "",
    category: null,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategorySelect = (categoryData) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryData,
    }));
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First create the product
      const productResponse = await api.post("/products/", {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        brand: formData.brand,
        size: formData.size,
        condition: formData.condition,
        color: formData.color,
        category: formData.category?.categoryId,
        subcategory: formData.category?.subcategoryId,
      });

      // Then upload images if there are any
      if (formData.images.length > 0) {
        const imageFormData = new FormData();
        formData.images.forEach((image) => {
          imageFormData.append("image", image);
        });
        imageFormData.append("product", productResponse.data.id);

        await api.post("/upload-product-images/", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Redirect or show success message
      console.log("Product created successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="sell-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Vends ton article
      </Typography>

      <form onSubmit={handleSubmit}>
        <Paper elevation={0} className="sell-section">
          <Typography variant="h6" gutterBottom>
            Ajouter des photos
          </Typography>
          <ImageUploader onChange={handleImagesChange} />
        </Paper>

        <Paper elevation={0} className="sell-section">
          <Typography variant="h6" gutterBottom>
            Catégorie
          </Typography>
          <CategorySelector onCategorySelect={handleCategorySelect} />
        </Paper>

        <Paper elevation={0} className="sell-section">
          <Typography variant="h6" gutterBottom>
            Détails du produit
          </Typography>
          <div className="form-fields">
            <TextField
              fullWidth
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Taille"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="État"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Couleur"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Prix (€)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
          </div>
        </Paper>

        {error && (
          <Typography color="error" className="error-message">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Publication en cours..." : "Publier maintenant"}
        </Button>
      </form>
    </Container>
  );
}

export default Sell;
