import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingUI from "../views/pages/BookingUI";
import Loading from "../views/components/Loading"; // Import a processing page component
import { useCarpark } from "../context/CarparkContext";

const BookingController = () => {
  const { carparkName } = useParams();
  const navigate = useNavigate();
  const carparkInstance = useCarpark(); // Instantiate the Carpark class
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [hasTriedBooking, setHasTriedBooking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // State to handle processing page
  const [carparkDetails, setCarparkDetails] = useState(null); // Store carpark details

  useEffect(() => {
    const fetchCarparkDetails = async () => {
      await carparkInstance.loadCarparkData(); // Load carpark data from the API
      const carparks = carparkInstance.getCarparks();

      // Find the target carpark by its name
      const targetCarpark = carparks.find(
        (carpark) =>
          carpark.carparkNumber.toLowerCase().replace(/\s+/g, "") ===
          carparkName.toLowerCase()
      );

      if (targetCarpark) {
        setCarparkDetails(targetCarpark);
      } else {
        alert("⚠️ Carpark not found. Please try again.");
        navigate("/home");
      }
    };

    fetchCarparkDetails();
  }, [carparkName, carparkInstance, navigate]);

  useEffect(() => {
    if (hasTriedBooking || !carparkDetails) return;

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Check for active bookings
    const hasOtherActiveBooking = bookings.some(
      (b) =>
        b.status === "Booking pending" || b.status === "Booking confirmed"
    );

    if (hasOtherActiveBooking) {
      alert(
        "⚠️ You already have an active booking. Please check in or check out before booking a new slot."
      );
      setHasTriedBooking(true);
      navigate("/home");
      return;
    }

    // Find the target carpark in localStorage bookings
    const bookingIndex = bookings.findIndex(
      (b) => b.carpark.toLowerCase() === carparkDetails.carparkNumber.toLowerCase()
    );

    if (bookingIndex !== -1) {
      const targetBooking = bookings[bookingIndex];

      // Update the target carpark's status
      if (targetBooking.status === "No booking") {
        setIsProcessing(true); // Show the processing page

        setTimeout(() => {
          bookings[bookingIndex] = {
            ...targetBooking,
            slotsReserved: targetBooking.slotsReserved + 1,
            slotsAvailable: Math.max(targetBooking.slotsAvailable - 1, 0),
            status: "Booking pending",
            startTime: new Date().getTime() + 10 * 1000,
          };

          localStorage.setItem("bookings", JSON.stringify(bookings));
          setBookingSuccess(true);
          setHasTriedBooking(true);
          setIsProcessing(false); // Hide the processing page
          console.log("✅ Booking updated in localStorage.");
        }, 2000); // Simulate a delay for processing
      }
    } else {
      alert("⚠️ Booking not found for the selected carpark.");
      setHasTriedBooking(true);
      navigate("/home");
    }
  }, [carparkDetails, hasTriedBooking, navigate]);

  useEffect(() => {
    if (!bookingSuccess) return;

    const timeoutId = setTimeout(() => {
      navigate("/home");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [bookingSuccess, navigate]);

  if (isProcessing) {
    return <Loading />;
  }

  return (
    <BookingUI
      bookingSuccess={bookingSuccess}
      hasTriedBooking={hasTriedBooking}
    />
  );
};

export default BookingController;