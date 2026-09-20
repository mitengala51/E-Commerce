export default function AdminStatCard({ label, value, icon, note }) {
  return (
    <div className="admin-card p-3 h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="admin-muted">{label}</div>
          <div className="h4 mb-0 mt-1">{value}</div>
        </div>
        <div style={{ color: "#bbb" }}>{icon}</div>
      </div>
      {note ? <div className="admin-muted mt-2">{note}</div> : null}
    </div>
  );
}
