import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CheckInUI from "../views/pages/CheckInUI";

function CheckInController() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
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

  useEffect(() => {
    if (booking && booking.startTime) {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeDifference = (booking.startTime - currentTime) / 1000;

        if (timeDifference < 0) {
          setError("Check-in window expired! Booking canceled.");
          const updatedBookings = JSON.parse(localStorage.getItem("bookings")).map((b) =>
            b.id === booking.id
              ? {
                  ...b,
                  status: "No booking",
                  slotsAvailable: b.slotsAvailable + 1,
                  slotsReserved: Math.max(0, b.slotsReserved - 1),
                }
              : b
          );
          localStorage.setItem("bookings", JSON.stringify(updatedBookings));
          setTimeout(() => navigate("/home"), 2000);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [booking, navigate]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError("");
        },
        () => {
          setError("Please enable location permissions to check in.");
        }
      );
    }
  };

  const handleCheckIn = () => {
    if (!booking) {
      setError("No active booking found.");
      return;
    }

    const currentTime = new Date().getTime();
    const timeDifference = (booking.startTime - currentTime) / 1000;

    if (timeDifference > 10) {
      setError("You can only check in within 10 seconds of the booking start time.");
      return;
    }

    if (!currentLocation) {
      getLocation();
      return;
    }

    if (timeDifference > 0) {
      alert("Check-in successful!");
      const updatedBookings = JSON.parse(localStorage.getItem("bookings")).map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: "Booking confirmed",
              slotsReserved: Math.max(0, b.slotsReserved - 1),
            }
          : b
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      navigate("/home");
    }
  };

  return (
    <CheckInUI
      booking={booking}
      error={error}
      handleCheckIn={handleCheckIn}
    />
  );
}

export default CheckInController;