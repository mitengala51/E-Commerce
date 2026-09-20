import CardContent from "@mui/joy/CardContent";
import CardCover from "@mui/joy/CardCover";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Grid from '@mui/material/Grid';

export default function AboutUs() {
  return (
    <div className="row px-xl-5 py-4 mx-sm-5 mx-2 gap-3 justify-content-center">
      <div className="col-12">
        <h1 className="text-center my-3">About Divya Collection</h1>
      </div>
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-6 mb-3">
          <img
            src="/shop.png"
            loading="lazy"
            alt="shop image"
            className="img-fluid rounded"
          />
        </div>

        <div className="col-lg-6">
          <p className="fs-5 fw-normal">
            Welcome to <strong>Divya Collection</strong> — your one-stop shop
            for elegant, affordable, and trendy products. We are passionate
            about offering you the best in fashion, accessories, and lifestyle
            products. <br></br>
            <br></br> Since our inception, we've served thousands of happy
            customers and continue to grow with love and trust. Each product we
            offer is carefully curated to bring value and beauty into your
            life.Our mission is to make stylish and high-quality products
            accessible to everyone while ensuring a seamless shopping
            experience.
          </p>
        </div>
      </div>

      {/* <div className="row mt-5">
        <div className="col-12 mb-4">
          <h1 className="text-center my-3">Why Choose Us?</h1>
        </div>

        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
            className="text-center shadow p-3 rounded border border-dark-subtle"
          >
            <h3 style={{ color: "#007bff" }}>Our Mission</h3>
            <p>
              To provide top-quality, affordable products that bring joy and
              satisfaction to our customers.
            </p>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
            className="text-center shadow p-3 rounded border border-dark-subtle"
          >
            <h3 style={{ color: "#007bff" }}>Our Vision</h3>
            <p>
              To become a leading brand known for trust, innovation, and
              customer care in the e-commerce space.
            </p>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
            className="text-center shadow p-3 rounded border border-dark-subtle"
          >
            <h3 style={{ color: "#007bff" }}>Our Values</h3>
            <p>
              We value fast delivery, customer-first service, easy returns, and
              products that customers truly love.
            </p>
          </Grid>
        </Grid>
      </div> */}

    </div>
  );
}
