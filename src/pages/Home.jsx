import React from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import balImage from "../assets/bal.jpeg";
import "./Home.css";

const FEATURED_ITEMS = [
  {
    id: 1,
    title: "Robe d'été fleurie",
    price: "25,00 €",
    size: "M",
    brand: "Zara",
    image: "https://picsum.photos/200/300",
  },
  {
    id: 2,
    title: "Jean slim noir",
    price: "30,00 €",
    size: "38",
    brand: "Levi's",
    image: "https://picsum.photos/200/301",
  },
  {
    id: 3,
    title: "T-shirt blanc basique",
    price: "12,00 €",
    size: "L",
    brand: "H&M",
    image: "https://picsum.photos/200/302",
  },
  // Add more items as needed
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <Box className="hero-text">
            <Typography variant="h1">
              Prêts à faire du tri dans vos placards ?
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/sell")}
              className="hero-button"
            >
              Commencer à vendre
            </Button>
            <Typography variant="body1" className="hero-description">
              Découvrez comment ça marche
            </Typography>
          </Box>
          <div className="hero-image-container">
            <img src={balImage} alt="Vinted Hero" className="hero-image" />
          </div>
        </div>
      </div>

      <Container className="featured-section">
        <Typography variant="h2" className="section-title">
          Articles populaires
        </Typography>
        <Grid container spacing={3}>
          {FEATURED_ITEMS.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card
                className="item-card"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={item.image}
                  alt={item.title}
                  className="item-image"
                />
                <CardContent className="item-content">
                  <Typography variant="h6" className="item-price">
                    {item.price}
                  </Typography>
                  <Typography variant="body2" className="item-details">
                    {item.size} • {item.brand}
                  </Typography>
                  <Typography variant="body2" className="item-title">
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
