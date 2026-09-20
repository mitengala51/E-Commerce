import Button from "@mui/joy/Button";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDescription({ data }) {

  const notify = () => toast.success('Added to cart!');
    const errorNotify = (message) => toast.error(message);

  async function handleClick() {
    try {
      console.log(data)

      if (data.length === 0) {
        return console.log("Data not found");
      }

      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/add-to-cart`, {
        id: data[0].id,
        title: data[0].title,
        price: data[0].price,
        brand: data[0].brand,
        size: data[0].size,
        category: data[0].category,
        image_url: data[0].image_url[0],
      },{
        withCredentials: true
      }).then(()=>{
        notify()
      });
    } catch (error) {
      console.log(error);
      if(error.status === 401) errorNotify('Almost there! Please sign in to order')

    }
  }

  const style = {
    color: "#595c5f",
  };

  return (
    <div className="col">
      <Toaster />
      <p className="col h1">{data[0]?.title}</p>
      <p className="col h2">Rs {data[0]?.price}</p>
      <p className="col pt-2" style={style}>
        {data[0]?.short_description}
      </p>
      <div className="col">

        <p className="col h5 my-4">
          Category: <span className="fw-normal">{data[0]?.category}</span>
        </p>

        <p className="col h5 my-4">
          Brand: <span className="fw-normal">{data[0]?.brand}</span>
        </p>

        {data[0]?.size && (
          <p className="col h5 my-4">
            Size: <span className="fw-normal">{data[0]?.size}</span>
          </p>
        )}
        
      </div>
      <p className="col h4">Detailed Description</p>
      <p className="col" style={style}>
        {data[0]?.detail_description}
      </p>
      <div className="col">
        {" "}
        <Button
          size="lg"
          sx={{ backgroundColor: "#1976d2", padding: "12px 30px 12px 30px" }}
          className="fs-5 fw-normal my-2"
          onClick={handleClick}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
