import { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import CartProduct from "../Components/Cart/CartProduct";
import TotalCartTable from "../Components/Cart/TotalCartTable";
import { LoggedIn } from "../Components/context/loggedIn";
import Loader from "../Components/Common/Loader";
import axios from "axios";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const [cartDeleted, setCartDeleted] = useState(false);
  const [OrderQuantity, setOrderQuantity] = useState(1);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false)

  const { loggedIn } = useContext(LoggedIn)

  useEffect(() => {
    async function fetchdata() {
      try {
        setLoading(true)
        const data = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/cart-items`,
          {
            withCredentials: true,
          }
        );
        setCartItems(data.data.all_cart_items);
        if(volume > 1) return
        const cost = data.data.all_cart_items.reduce(
          (accumulator, item) => accumulator + item?.price * item?.quantity,
          0
        );
        // console.log("Cost: ",cost)
        setTotalPrice(cost);
        // console.log("loggedIn: ", loggedIn)
      } catch (error) {
        console.log(error);
        if(error.status === 401){
          setCartItems([]);
          setTotalPrice(0)
        }
      }finally{
        setLoading(false)
      }
    }
    fetchdata();
  }, [cartDeleted, loggedIn]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-100">
      <Navbar />
      <div className="p-3 p-sm-5">
        <div className="">
          <h1 className="h2 text-center">Your Shopping Cart</h1>
          <p className="text-center">
            You have {cartItems.length} items in your cart
          </p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((data) => {
              return (
                <CartProduct
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  price={data.price}
                  brand={data.brand}
                  productQuantity={data.quantity}
                  image_url={data.image_url}
                  cartDeleted={cartDeleted}
                  setCartDeleted={setCartDeleted}
                  totalPrice={totalPrice}
                  setTotalPrice={setTotalPrice}
                  OrderQuantity={OrderQuantity}
                  setOrderQuantity={setOrderQuantity}

                  volume={volume}
                  setVolume={setVolume}
                />
              );
            })}
          </div>
          <div className="col-lg-4">
            <TotalCartTable totalItems={cartItems.length} price={totalPrice} quantity={OrderQuantity} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
