import { useContext } from "react";
import { useRazorpay } from "react-razorpay";
import axios from "axios";
import toast from "react-hot-toast";
import { LoggedIn } from "../context/loggedIn";

export default function TotalCartTable({ totalItems, price, quantity }) {

  const { loggedIn } = useContext(LoggedIn)

  // console.log(price)

  const {Razorpay} = useRazorpay();

  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZOR_PAY_KEY_ID;

  const notify = (message) => toast.success(message)
  const Errornotify = (message) => toast.error(message);

  const handlePayment = async () => {
    try {

      if(totalItems === 0) return Errornotify('Your cart is empty')

      // Make the API call to backend
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: price * 100 }),
      });

      const data = await response.json();
      // console.log("RazorPay Order: ", data?.orders?.id)
    // add option for the payment gateway it can be dynamic if you want 
    // we can use prop drilling to make it dynamic
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: data?.orders?.currency,
        name: "Divya Collection", // Add company details
        description: "Payment for your order", // Add order details
        order_id: data?.orders?.id,
        // this is make function which will verify the payment
        // after making the payment 
        handler: async (response) => {
          try {
            // console.log("RazorPay Respose: ", response)
            const payment = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            
              body: JSON.stringify({
                razorpay_order_id: response?.razorpay_order_id,
                razorpay_payment_id: response?.razorpay_payment_id,
                razorpay_signature: response?.razorpay_signature,
              }),
            });

            if(payment?.status !== 200) return Errornotify("Payment Failed")
            // Add onPaymentSuccessfull function here
            const data = await axios.post(
              `${import.meta.env.VITE_REACT_APP_API_URL}/api/order`,
              {
                total_amount: price,
                quantity,
              },
              {
                withCredentials: true,
              },
            );

          if(data?.status === 200) return notify("Payment successful and Order Placed Successfully!");

          } catch (err) {
            // Add onPaymentUnSuccessfull function here
            console.log("Payment Error: ", err)
            alert("Payment failed");
          }
        },
        // handler: (response)=>console.log("Razorpay Response After Payment: ", response),
        prefill: {
          name: "John Doe", // add customer details
          email: "john@example.com", // add customer details
          contact: "9999999999", // add customer details
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
    // you can change the gateway color from here according to your
    // application theme
          color: "#3399cc",
        },
      };
      const rzpay = new Razorpay(options);
      // this will open razorpay window for take the payment in the frontend
      // under the hood it use inbuild javascript windows api 
      // console.log("Razorpay Object: ", rzpay)
      rzpay.open(options);


    } catch (err) {
      alert("Error creating order: " + err.message);
    }
  };

  return (
    <div className="p-3 shadow rounded-3">
      <h1 className="h4" style={{fontFamily: "Playwrite RO, cursive"}}>Cart Summary</h1>

      <div className="d-flex justify-content-between">
        <p>Subtotal ({totalItems} items)</p>
        <p>₹{price}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p>Shipping</p>
        <p>Free</p>
      </div>

      <hr></hr>

      <div className="d-flex justify-content-between">
        <p>Total Amount</p>
        <p>Rs {price}</p>
      </div>

      <div className="d-grid gap-2 col-12 mx-auto">
        <button className="btn btn-primary" type="button" onClick={() =>{loggedIn? handlePayment() : Errornotify("Almost there! Please sign in to order")}}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
