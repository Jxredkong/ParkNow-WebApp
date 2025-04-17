import { useState, useEffect } from "react";
import "../../styles/Home.css";
import BrowseCarparkController from "../../controllers/BrowseCarparkController";
import NavigationMenu from "../components/NavigationMenu";
import { useNavigate } from "react-router-dom";
import { useCarpark } from "../../context/CarparkContext";

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const carparkInstance = useCarpark(); // Instantiate the Carpark class

  // Fetch carpark data and store it in localStorage
  useEffect(() => {
    const fetchCarparkData = async () => {
      const storedBookings = localStorage.getItem("bookings");

      if (!storedBookings) {
        // If localStorage is empty, fetch data from the API
        await carparkInstance.loadCarparkData();
        const carparkData = carparkInstance.getCarparks();
        console.log("Fetched carpark data:", carparkData);

        // Format the data for the application
        const formattedBookings = carparkData.map((carpark, index) => {
          // Try to get address information from the data.gov.sg API
          const fetchAddressForCarpark = async (carparkNumber) => {
            try {
              const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
              const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${datasetId}&q=${carparkNumber}`;
              const response = await fetch(url);
              const data = await response.json();
              
              if (data.result && data.result.records && data.result.records.length > 0) {
                // Find exact match for carpark number
                const exactMatch = data.result.records.find(
                  record => record.car_park_no === carparkNumber
                );
                
                if (exactMatch && exactMatch.address) {
                  return exactMatch.address;
                }
              }
            } catch (error) {
              console.error(`Error fetching address for ${carparkNumber}:`, error);
            }
            return "Unknown Location";
          };

          return {
            id: index + 1,
            name: `Booking ${index + 1}`,
            carpark: carpark.carparkNumber,
            slotsAvailable: carpark.availableLots,
            slotsReserved: carpark.totalLots - carpark.availableLots,
            status: "No booking",
            startTime: null,
            location: carpark.location || "Unknown Location", // Will be updated later
            carparkNumber: carpark.carparkNumber, // Store for address lookup
          };
        });

        // Save the formatted data to localStorage
        localStorage.setItem("bookings", JSON.stringify(formattedBookings));
        setBookings(formattedBookings); // Update the state

        // Now try to fetch addresses for all carparks asynchronously
        const updateAddresses = async () => {
          const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
          const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${datasetId}&limit=1000`;
          
          try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.result && data.result.records && data.result.records.length > 0) {
              // Create a map of carpark numbers to addresses
              const addressMap = {};
              data.result.records.forEach(record => {
                if (record.car_park_no && record.address) {
                  addressMap[record.car_park_no] = record.address;
                }
              });
              
              // Update the bookings with addresses
              const updatedBookings = formattedBookings.map(booking => {
                if (addressMap[booking.carpark]) {
                  return {
                    ...booking,
                    location: addressMap[booking.carpark]
                  };
                }
                return booking;
              });
              
              // Save updated bookings with addresses
              localStorage.setItem("bookings", JSON.stringify(updatedBookings));
              setBookings(updatedBookings);
            }
          } catch (error) {
            console.error("Error fetching addresses:", error);
          }
        };
        
        updateAddresses();
      } else {
        // If localStorage already has data, load it into state
        setBookings(JSON.parse(storedBookings));
      }
    };

    fetchCarparkData();
  }, [carparkInstance]);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  // Handle search selection
  const handleSearchSelect = (carpark) => {
    setSearchTerm(carpark ? carpark.label : "");
  };

  // Redirect to Check-In page
  const handleCheckInRedirect = (bookingId) => {
    navigate(`/checkin/${bookingId}`);
  };

  // Redirect to Check-Out page
  const handleCheckOutRedirect = (bookingId) => {
    navigate(`/checkout/${bookingId}`);
  };

  // Filter bookings based on the search term
  const filteredBookings = bookings.filter((booking) =>
    booking.carpark.toLowerCase().includes(searchTerm.toLowerCase()) &&
    booking.status !== "No booking"
  );

  return (
    <div>
      {/* Navigation Menu */}
      <NavigationMenu />

      {/* Search and Carpark List */}
      <div className="home-container">
        <BrowseCarparkController onSearchSelect={handleSearchSelect} />

        <div className="bookings-list">
          <h2 className="bookings-header">Current Carpark Bookings</h2>

          <table className="bookings-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Carpark</th>
                <th>Slots Available</th>
                <th>Slots Reserved</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.carpark}</td>
                  <td>{booking.slotsAvailable}</td>
                  <td>{booking.slotsReserved}</td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.status === "No booking" && (
                      <button className="action-button" disabled>
                        Not Available
                      </button>
                    )}
                    {booking.status === "Booking pending" && (
                      <button
                        className="action-button"
                        onClick={() => handleCheckInRedirect(booking.id)}
                      >
                        Check In
                      </button>
                    )}
                    {booking.status === "Booking confirmed" && (
                      <button
                        className="action-button"
                        onClick={() => handleCheckOutRedirect(booking.id)}
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;