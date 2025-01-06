import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../../contexts/AuthContext";
import "./ImageUploader.css";

function ImageUploader({ onChange }) {
  const { api } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState({});
  const [rotations, setRotations] = useState({});
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const newLoadingState = {};
      const newRotationState = {};

      const imagePreviews = acceptedFiles.map((file) => {
        const id = Math.random().toString(36).substring(7);
        newLoadingState[id] = true;
        newRotationState[id] = 0;
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          id,
        });
      });

      setLoading((prev) => ({ ...prev, ...newLoadingState }));
      setRotations((prev) => ({ ...prev, ...newRotationState }));

      const newImages = [...images, ...imagePreviews];
      setImages(newImages);

      // Simulate upload delay
      await Promise.all(
        imagePreviews.map(async (image) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setLoading((prev) => ({ ...prev, [image.id]: false }));
        })
      );

      onChange?.(newImages);
    },
    [images, onChange]
  );

  const removeImage = (index) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.preview);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange?.(newImages);
  };

  const rotateImage = (index) => {
    const image = images[index];
    const newRotation = (rotations[image.id] || 0) + 90;
    setRotations((prev) => ({ ...prev, [image.id]: newRotation }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 20,
  });

  return (
    <div className="image-uploader">
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={image.id} className="image-preview-container">
            <div className="image-preview-wrapper">
              <img
                src={image.preview}
                alt="Preview"
                className="image-preview"
                style={{
                  transform: `rotate(${rotations[image.id] || 0}deg)`,
                }}
              />
              <div className="delete-overlay">
                {loading[image.id] ? (
                  <CircularProgress size={30} className="upload-spinner" />
                ) : (
                  <div className="image-actions">
                    <button
                      className="action-button rotate-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateImage(index);
                      }}
                      type="button"
                      aria-label="Rotation de l'image"
                    >
                      <RotateRightIcon />
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      type="button"
                      aria-label="Supprimer l'image"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {images.length < 20 && (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <Box className="dropzone-content">
              <AddPhotoAlternateIcon className="upload-icon" />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {isDragActive ? "Déposez les images ici" : "Ajouter des photos"}
              </Typography>
            </Box>
          </div>
        )}
      </div>
      <div className="upload-controls">
        <Typography variant="caption" className="upload-hint">
          Formats acceptés : JPG, JPEG, PNG • Max 20 photos • Première photo =
          photo principale
        </Typography>
        {uploadStatus && (
          <Typography
            className={`upload-status ${
              uploadStatus.includes("failed") ? "error" : ""
            }`}
          >
            {uploadStatus}
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
