export default function AdminState({ loading, error, empty, emptyText, onRetry }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h2 className="h6">Something went wrong</h2>
        <p className="admin-muted mb-3">{error}</p>
        {onRetry ? (
          <button type="button" className="btn btn-dark" onClick={onRetry}>
            Try Again
          </button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="text-center py-5">
        <h2 className="h6">Nothing here yet</h2>
        <p className="admin-muted mb-0">{emptyText}</p>
      </div>
    );
  }

  return null;
}
