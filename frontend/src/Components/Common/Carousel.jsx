import { Link } from "react-router";

export default function Carousel() {
  return (
    <>
      {/* <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="0"
            className=""
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
            className=""
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
            className="active"
            aria-current="true"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item">
            <img
              src={`/Carousel Images/New Collection.png`}
              alt="Product"
              style={{ width: "100%", height: "560px", objectFit: "cover" }}
            />

            <div className="container">
              <div className="carousel-caption text-start">
                <h1>Classic Elegance</h1>
                <p>
                Discover our handpicked collection of stylish footwear, chic purses,<br></br> and everyday essentials crafted just for her. Step into fashion made <br></br> for every walk of life.
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">

            <img
              src={`/Carousel Images/Shoes and Wallet.jpg`}
              alt="Product"
              style={{ width: "100%", height: "560px", objectFit: "cover" }}
            />

            <div className="container">
              <div className="carousel-caption">
                <h1>Built for Comfort. Styled for You.</h1>
                <p>
                Explore sleek formal shoes, rugged sandals, and casual must-haves designed for modern men. Step up your look with ease and attitude.
                </p>
                <p>
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item active">
            <img
              src={`/Carousel Images/Travel-Bags.jpg`}
              alt="Product"
              style={{ width: "100%", height: "560px", objectFit: "cover" }}
            />

            <div className="container">
              <div className="carousel-caption text-end">
                <h1>Carry Power in Style</h1>
                <p>
                Sleek laptop bags and professional carriers designed for durability, <br></br> functionality, and the everyday hustle. Stay organized, look sharp.
                </p>
                <p>
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div> */}

      {/* <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              src={`/Carousel Images/New Collection.png`}
              class="d-block w-100 object-fit-cover"
              alt="New Collection"
            />
          </div>
          <div class="carousel-item">
            <img
              src={`/Carousel Images/Trending Now.png`}
              class="d-block w-100"
              alt="Trending Now"
            />
          </div>
          <div class="carousel-item">
            <img
              src={`/Carousel Images/Best Selling.png`}
              class="d-block w-100"
              alt="Best Selling"
            />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div> */}

      <div
        id="carouselExampleAutoplaying"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner">
          <Link to="/product-detail" state={{ id: "P004" }} data-bs-interval="5000">
            <div class="carousel-item active">
              <img
                src={`/Carousel Images/New Collection.png`}
                class="d-block w-100 object-fit-cover"
                alt="New Collection"
              />
            </div>
          </Link>

          <Link to="/product-detail" state={{ id: "P003" }}>
            {" "}
            <div class="carousel-item" data-bs-interval="5000">
              <img
                src={`/Carousel Images/Trending Now.png`}
                class="d-block w-100"
                alt="Trending Now"
              />
            </div>
          </Link>

          <Link to="/product-detail" state={{ id: "P005" }}>
            {" "}
            <div class="carousel-item" data-bs-interval="5000">
              <img
                src={`/Carousel Images/Best Selling.png`}
                class="d-block w-100"
                alt="Best Selling"
              />
            </div>
          </Link>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}
