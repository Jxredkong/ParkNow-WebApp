import "../../styles/Check.css";

function CheckOutUI({ booking, error, handleCheckOut }) {
  return (
    <div className="parent-container">
      <div className="checkin-container">
        <h2>Check-Out</h2>
        {error && <p className="error">{error}</p>}
        <p><strong>Carpark:</strong> {booking?.carpark || "Loading..."}</p>
        <p><strong>Status:</strong> {booking?.status || "Loading..."}</p>
        <button onClick={handleCheckOut} disabled={!booking}>
          Check Out
        </button>
      </div>
    </div>
  );
}

export default CheckOutUI;