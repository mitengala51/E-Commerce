import { useState, useEffect } from "react";
import Navbar from "../Components/Layout/Navbar";
import Carousel from "../Components/Common/Carousel";
import Header from "../Components/Common/Header";
import Product from "../Components/Products/Product";
import Brands from "../Components/Infinite-Brand-Carousel/Brands";
import CategoryImages from "../Components/Category/CategoryImages";
import Footer from "../Components/Layout/Footer";
import axios from "axios";

export default function HomePage() {
  const [result, setResult] = useState([]);
  const [best_selling, setBestSelling] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchdata() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/all-products`
        );
        // console.log(data.data.all_products[0].image_url);
        setBestSelling(data.data.all_products.filter((item) => item.best_selling))
        setResult(data.data.all_products);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    }

    fetchdata();
  }, []);

  return (
    <div>
      <Navbar />
      <Carousel />
      <Header title="SHOP BY BRAND" hide={true} />
      <Brands />
      <Header title="NEW ARRIVAL" />
      <Product product_data={result} spinner={loading}/>
      <Header title="BEST SELLING" />
      <Product product_data={best_selling} spinner={loading} />
      <Header title="CATEGORY" hide={true} />
      <CategoryImages />
      <Footer />
    </div>
  );
}
