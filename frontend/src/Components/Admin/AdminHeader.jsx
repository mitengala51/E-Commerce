import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";

export default function AdminHeader({ title, subtitle, onMenuClick, admin }) {
  const initial = admin?.full_name
    ? admin.full_name.charAt(0).toUpperCase()
    : admin?.email
    ? admin.email.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="admin-header d-flex justify-content-between align-items-center px-3 px-md-4 py-3">
      <div className="d-flex align-items-center gap-2">
        <Button
          sx={{
            color: "black",
            minWidth: "40px",
            display: { xs: "inline-flex", md: "none" },
          }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </Button>

        <div>
          <h1 className="h5 mb-0">{title}</h1>
          <div className="admin-muted">{subtitle}</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <div className="text-end d-none d-sm-block">
          <div style={{ fontSize: "15px" }}>
            {admin?.full_name || "Administrator"}
          </div>
          <div className="admin-muted">{admin?.email}</div>
        </div>
        <Avatar sx={{ bgcolor: "black", width: 38, height: 38 }}>
          {initial}
        </Avatar>
      </div>
    </div>
  );
}
