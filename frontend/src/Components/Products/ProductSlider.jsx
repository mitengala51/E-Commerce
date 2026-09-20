import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Rating from '@mui/material/Rating';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import IconButton from '@mui/joy/IconButton';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "./ProductSlider.css"; // Make sure to create this file for custom styles

const CustomButtonGroup = ({ next, previous }) => {
  return (
    <div className="custom-arrow-container">
      <div 
        className="custom-arrow prev"
        onClick={previous}
      >
        <FaChevronLeft color="#333" size={18} />
      </div>
      <div 
        className="custom-arrow next"
        onClick={next}
      >
        <FaChevronRight color="#333" size={18} />
      </div>
    </div>
  );
};

function ProductSlider() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 2,
      slidesToSlide: 1
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

  const products = [
    {
      id: 1,
      product_name: "Nike Air Max Plus",
      price: "₹15,995",
      rating: 4.5,
      discount: "20% OFF",
      isNew: true,
      image_url: "/api/placeholder/300/300"
    },
    {
      id: 2,
      product_name: "Nike Dunk Low Retro",
      price: "₹8,295",
      rating: 4.2,
      discount: "",
      isLowStock: true,
      image_url: "/api/placeholder/300/300"
    },
    {
      id: 3,
      product_name: "Air Jordan 1 Low",
      price: "₹7,295",
      rating: 4.8,
      discount: "15% OFF",
      image_url: "/api/placeholder/300/300"
    },
    {
      id: 4,
      product_name: "Nike Quest 5",
      price: "₹6,295",
      rating: 4.0,
      image_url: "/api/placeholder/300/300"
    },
    {
      id: 5,
      product_name: "Nike Air Zoom Structure",
      price: "₹10,995",
      rating: 4.6,
      isNew: true,
      image_url: "/api/placeholder/300/300"
    },
  ];

  return (
    <div className="product-slider-container">
      <div className="product-slider-header">
        <Typography level="h2" component="h2">Featured Products</Typography>
        <Button variant="outlined" endDecorator={<FaChevronRight />}>View All</Button>
      </div>
      
      <Carousel
        responsive={responsive}
        infinite={true}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["mobile"]}
        arrows={false}
        customButtonGroup={<CustomButtonGroup />}
        renderButtonGroupOutside={true}
      >
        {products.map((product) => (
          <Card key={product.id} className="product-card" variant="outlined">
            <CardOverflow>
              <AspectRatio ratio="1" className="product-image-container">
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="product-image"
                />
                <div className="product-badges">
                  {product.isNew && (
                    <Chip className="product-badge new" color="primary" size="sm">NEW</Chip>
                  )}
                  {product.discount && (
                    <Chip className="product-badge discount" color="danger" size="sm">{product.discount}</Chip>
                  )}
                </div>
                <IconButton 
                  className="wishlist-button" 
                  variant="soft" 
                  color="neutral"
                  size="sm"
                >
                  <FavoriteBorderIcon />
                </IconButton>
              </AspectRatio>
            </CardOverflow>
            
            <CardContent className="product-content">
              <Typography level="body-sm" className="product-category">Footwear</Typography>
              <Typography level="title-md" className="product-name">{product.product_name}</Typography>
              
              <div className="product-rating">
                <Rating value={product.rating} precision={0.1} size="small" readOnly />
                <Typography level="body-xs">({product.rating})</Typography>
              </div>
              
              <div className="product-price-container">
                <Typography level="title-lg" className="product-price">
                  {product.price}
                </Typography>
                {product.isLowStock && (
                  <Typography level="body-xs" color="danger" className="stock-warning">
                    Only few left
                  </Typography>
                )}
              </div>
            </CardContent>
            
            <CardOverflow>
              <Button 
                className="add-to-cart-button" 
                variant="solid" 
                color="primary" 
                size="md" 
                startDecorator={<AddShoppingCartIcon />}
                fullWidth
              >
                Add to cart
              </Button>
            </CardOverflow>
          </Card>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductSlider;