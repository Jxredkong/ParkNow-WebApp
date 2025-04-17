import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CheckOutUI from "../views/pages/CheckOutUI";

function CheckOutController() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const foundBooking = savedBookings.find(
      (booking) => booking.id.toString() === bookingId
    );

    if (foundBooking) {
      setBooking(foundBooking);
    } else {
      setError("No active booking found.");
      setTimeout(() => navigate("/home"), 2000);
    }
  }, [bookingId, navigate]);

  const handleCheckOut = () => {
    if (!booking) {
      setError("No active booking found.");
      return;
    }

    if (booking.status !== "Booking confirmed") {
      setError("You do not have a confirmed booking to check out.");
      return;
    }

    alert("Check-out successful!");
    const updatedBookings = JSON.parse(localStorage.getItem("bookings")).map((b) =>
      b.id === booking.id
        ? {
            ...b,
            status: "No booking",
            slotsAvailable: b.slotsAvailable + 1,
          }
        : b
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    navigate("/home");
  };

  return (
    <CheckOutUI
      booking={booking}
      error={error}
      handleCheckOut={handleCheckOut}
    />
  );
}

export default CheckOutController;