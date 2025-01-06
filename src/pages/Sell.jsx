import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Alert,
} from "@mui/material";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import CategorySelector from "../components/CategorySelector/CategorySelector";
import { useAuth } from "../contexts/AuthContext";
import "./Sell.css";

const Sell = () => {
  const { api } = useAuth();
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      condition: "",
      images: [],
      category: null,
    },
  });

  const handleCategorySelect = (category) => {
    setValue("category", category);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData object
      const formData = new FormData();

      // Add text fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", parseFloat(data.price));
      formData.append("condition", data.condition);
      formData.append("categoryId", data.category?.categoryId);
      if (data.category?.subcategoryId) {
        formData.append("subcategoryId", data.category.subcategoryId);
      }

      // Add images
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("file", image);
        });
        formData.append(
          "images",
          JSON.stringify(data.images.map((_, i) => ({ order: i })))
        );
      }

      // Submit to API
      const response = await api.post("/create-product/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product created successfully:", response.data);

      // Reset form on success
      reset();

      // You might want to redirect to the product page or show a success message
    } catch (error) {
      console.error("Error creating product:", error);
      setSubmitError(
        error.response?.data?.error ||
          "Une erreur s'est produite lors de la création du produit"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page">
      <Container maxWidth="md">
        <Paper className="sell-form">
          <Typography variant="h1" className="form-title">
            Vends ton article
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <section className="form-section">
              <Typography variant="h2" className="section-title">
                Photos
              </Typography>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <ImageUploader onChange={field.onChange} />
                )}
              />
            </section>

            <Paper elevation={0} className="sell-section">
              <Typography variant="h6" gutterBottom>
                Catégorie
              </Typography>
              <CategorySelector onCategorySelect={handleCategorySelect} />
            </Paper>

            <section className="form-section">
              <Typography variant="h2" className="section-title">
                Détails
              </Typography>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Le titre est requis" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Titre"
                    fullWidth
                    placeholder="ex: Chemise Sézane verte"
                    error={!!error}
                    helperText={error?.message}
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                rules={{ required: "La description est requise" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="ex: Porté quelques fois, taille correctement"
                    error={!!error}
                    helperText={error?.message}
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="condition"
                control={control}
                rules={{ required: "L'état est requis" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="État"
                    fullWidth
                    placeholder="ex: Neuf avec étiquette"
                    error={!!error}
                    helperText={error?.message}
                    margin="normal"
                  />
                )}
              />
            </section>

            <section className="form-section">
              <Typography variant="h2" className="section-title">
                Prix
              </Typography>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Le prix est requis",
                  min: {
                    value: 0.01,
                    message: "Le prix doit être supérieur à 0",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Prix"
                    fullWidth
                    type="number"
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">€</InputAdornment>
                      ),
                      inputProps: {
                        min: 0,
                        step: "0.01",
                      },
                    }}
                  />
                )}
              />
            </section>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {submitError}
              </Alert>
            )}

            <Box className="form-actions">
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Sell;
