import React from "react";

function BookingUI({ bookingSuccess, hasTriedBooking }) {
  if (!hasTriedBooking) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <h2>Processing your booking...</h2>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div style={{ textAlign: "center", padding: "80px" }}>
        <h2>✅ Booking Successful! 🚗</h2>
        <p>Redirecting you to Home...</p>
      </div>
    );
  }

  return null;
}

export default BookingUI;