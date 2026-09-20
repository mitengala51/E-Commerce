import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

export default function Header(props) {

  const navigate = useNavigate()

  return (
    <div className="container-fluid px-0">
      <div className="p-4 d-flex justify-content-between mt-2">
        <h1>{props.title}</h1>
        <Button
          variant="contained"
          hidden={props.hide}
          sx={{ height: "40px", backgroundColor: "black" }}
          onClick={()=>{ navigate("/shopping") }}
        >
          View All
        </Button>
      </div>
    </div>
  );
}
