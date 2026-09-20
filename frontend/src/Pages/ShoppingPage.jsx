import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import ProductGrid from "../Components/Products/ProductGrid";
import axios from "axios";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function Shopping() {
  const [result, setResult] = useState([]);
  const [loading, setloading] = useState(true);
  const [search, setSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    async function fetchdata() {
      try {
        setloading(true);
        const data = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/all-products`
        );
        // console.log(data.data.all_products[0].image_url);
        setResult(data.data.all_products);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    }

    fetchdata();
  }, []);

  async function SearchProduct(e) {
    try {
      setloading(true);
      // console.log(e.target.value);
      setSearch(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/search?product=${
          e.target.value
        }`
      );
      // console.log(response.data);
      setSearchData(response.data);
      // console.log(searchData);
      // console.log(typeof searchData);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  return (
    <div>
      <Navbar />

      {/* SearchBar Section */}
      <div className="d-flex flex-column justify-content-center text-center p-5">
        <h1>Divya Collection</h1>
        <p>Discover the finest footwear for every occasion</p>

        {/* <SearchBar /> */}
        <div className="rounded-lg shadow-md d-flex justify-content-center">
          {/* <button className='bg-body-secondary text-black p-2 rounded-lg shadow-md rounded-start-4 border-1'>Search</button> */}
          <div className="d-flex bg-white text-black rounded-5 shadow border border-grey" style={{minWidth:"40%"}}>

            <input
              type="text"
              className="bg-white text-black py-2 px-3 rounded-lg shadow-sm rounded-start-5 border-0"
              style={{ outline: "none", width:"100%"}}

              placeholder="Search for footwear, wallets, bags..."
              onChange={debounce(SearchProduct, 500)}
            ></input>

            <div className="d-flex justify-content-center p-2 align-items-center bg-white text-black rounded-lg rounded-end-5 border-0">

              <Search size={22} className="m-1 me-2" />
            </div>
          </div>      
        </div>
      </div>

      {/* Product List */}
      {search ? (
        <ProductGrid products={searchData} spinner={loading} />
      ) : (
        <ProductGrid products={result} spinner={loading} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
