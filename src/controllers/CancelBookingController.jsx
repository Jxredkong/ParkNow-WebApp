import {useEffect,useState} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import CancelBookingUI from "../views/pages/CancelBookingUI";
function CancelBookingController() {
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
         setTimeout(() => navigate("/home"), 2000); // Redirect after 2 seconds
       }
     }, [bookingId, navigate]);


   const handleCancelBooking = (event) => {
       if (!booking) {
           setError("No active booking found.");
           setTimeout(() => navigate("/home"), 2000);
         }
       if (booking.status !== "Booking pending") {
           setError("You do not have a confirmed booking to cancel.");
           setTimeout(() => navigate("/home"), 2000);
         }
        if (booking.status === "Booking pending") {
           const updatedBookings = JSON.parse(localStorage.getItem("bookings")).map(
               (b) =>
                 b.id === booking.id
                   ? { ...b, status: "No booking", slotsAvailable: b.slotsAvailable + 1, slotsReserved: Math.max(0, b.slotsReserved - 1), }
                   : b
             );
             localStorage.setItem("bookings", JSON.stringify(updatedBookings));
             alert("Cancellation successful!");
             navigate("/home");
       }
   }
   return (
    <CancelBookingUI
      booking={booking}
      error={error}
      handleCancelBooking={handleCancelBooking}
    />
  );
}

export default CancelBookingController;