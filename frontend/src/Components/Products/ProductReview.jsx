import React from "react";
import StarIcon from "@mui/icons-material/Star";
import LinearProgress from "@mui/material/LinearProgress";

export default function ProductReview() {
  const [progress, setProgress] = React.useState(10);

  return (
    <div className="col">
      <div className="col">
        <p className="py-2">
          4.5 <StarIcon sx={{ fontSize: "medium" }} /> (120 Reviews)
        </p>
      </div>
      <div className="col">
        <h3 className="h3">Rating Breakdown</h3>

        <div className="d-flex flex-row mb-3">
          <div className="p-2">5 Stars</div>
          <div className="p-2 w-75 align-self-center">
            <LinearProgress
              className="rounded-2"
              variant="determinate"
              value={70}
            />
          </div>
          <div className="p-2">50 Reviews</div>
        </div>

        <div className="d-flex flex-row mb-3">
          <div className="p-2">4 Stars</div>
          <div className="p-2 w-75 align-self-center">
            <LinearProgress
              className="rounded-2"
              variant="determinate"
              value={50}
            />
          </div>
          <div className="p-2">20 Reviews</div>
        </div>

        <div className="d-flex flex-row mb-3">
          <div className="p-2">3 Stars</div>
          <div className="p-2 w-75 align-self-center">
            <LinearProgress
              className="rounded-2"
              variant="determinate"
              value={30}
            />
          </div>
          <div className="p-2">20 Reviews</div>
        </div>

        <div className="d-flex flex-row mb-3">
          <div className="p-2">2 Stars</div>
          <div className="p-2 w-75 align-self-center">
            <LinearProgress
              className="rounded-2"
              variant="determinate"
              value={20}
            />
          </div>
          <div className="p-2">10 Reviews</div>
        </div>

        <div className="d-flex flex-row mb-3">
          <div className="p-2">1 Stars</div>
          <div className="p-2 w-75 align-self-center">
            <LinearProgress
              className="rounded-2"
              variant="determinate"
              value={10}
            />
          </div>
          <div className="p-2">10 Reviews</div>
        </div>
      </div>
    </div>
  );
}
