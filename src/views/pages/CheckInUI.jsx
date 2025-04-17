import "../../styles/Check.css";

function CheckInUI({ booking, error, handleCheckIn }) {
  return (
    <div className="parent-container">
      <div className="checkin-container">
        <h2>Check-In</h2>
        {error && <p className="error">{error}</p>}
        <p><strong>Carpark:</strong> {booking?.carpark || "Loading..."}</p>
        <p><strong>Check-in Window:</strong> 10 seconds</p>
        <button onClick={handleCheckIn} disabled={!booking}>
          Check In
        </button>
      </div>
    </div>
  );
}

export default CheckInUI;