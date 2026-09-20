import Typography from '@mui/joy/Typography';
import { Grid } from '@mui/material';

export default function CategoryImages() {
  return (
    <>
      <Grid container spacing={2} className="px-4">
        <Grid size={{ sm: 12, md: 6, lg: 6, xl: 6 }}>
          {" "}

          <div className="position-relative">
            <img
              src="/Category Images/Men's-Category.jpg"
              loading="lazy"
              alt="men category"
              className="img-fluid rounded-3 border border-grey"
            />
            <div style={{ position: "absolute", bottom: "2%", left: "4%" }}>
              <Typography
                level="body-lg"
                textColor="#fff"
                sx={{
                  fontWeight: "lg",
                  mt: { xs: 12, sm: 18, lg: 50 },
                  fontSize: "40px",
                }}
              >
                Men
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid size={{ sm: 12, md: 6, lg: 6, xl: 6 }}>
          {" "}
          <div className="position-relative">
            <img
              src="/Category Images/Women's-Category.jpg"
              loading="lazy"
              alt="men category"
              className="img-fluid rounded-3 border border-grey"
            />
            <div style={{ position: "absolute", bottom: "2%", left: "4%" }}>
              <Typography
                level="body-lg"
                textColor="#fff"
                sx={{
                  fontWeight: "lg",
                  mt: { xs: 12, sm: 18, lg: 50 },
                  fontSize: "40px",
                }}
              >
                Women
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
