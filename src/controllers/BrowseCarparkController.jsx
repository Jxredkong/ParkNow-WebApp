import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrowseCarparkUI from "../views/components/BrowseCarparkUI";
import { fetchCarparksByAddress } from "../services/carparkServices";

const BrowseCarparkController = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [options, setOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchingByAddress, setIsSearchingByAddress] = useState(false);
  const [addressResults, setAddressResults] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Load carpark data from localStorage (bookings)
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const formattedOptions = bookings.map((booking) => {
      const totalLots = booking.slotsAvailable + booking.slotsReserved;

      return {
        value: booking.carpark.toLowerCase().replace(/\s+/g, ""),
        label: booking.carpark,
        availableLots: booking.slotsAvailable,
        totalLots: totalLots,
        location: booking.location || "Unknown Location",
        rates: booking.rates || "$2.40/hr",
      };
    });

    setOptions(formattedOptions);
  }, []);

  const handleChange = (option) => {
    // Update the carpark's location in localStorage before navigating
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.map(booking => {
      if (booking.carpark.toLowerCase() === option.label.toLowerCase()) {
        return {
          ...booking,
          location: option.location || booking.location
        };
      }
      return booking;
    });
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    
    // Navigate to the carpark details page
    navigate(`/carpark/${option.value}`);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    setErrorMessage("");
    setCurrentPage(1);
    setIsSearchingByAddress(false);
    setAddressResults([]);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      if (searchTerm.trim() === "") {
        setErrorMessage("❌ Please enter a carpark ID or address");
        setShowTable(false);
        return;
      }

      // First try to find exact matches by carpark ID
      const filteredByID = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredByID.length > 0) {
        setShowTable(true);
        setIsSearchingByAddress(false);
        return;
      }

      // If no matches by ID, try searching by address
      try {
        const addressMatches = await fetchCarparksByAddress(searchTerm);
        
        if (addressMatches.length === 0) {
          setErrorMessage(`❌ No carparks found for address: "${searchTerm}"`);
          setShowTable(false);
          return;
        }

        setAddressResults(addressMatches);
        setIsSearchingByAddress(true);
        setShowTable(true);

        // Map address results to match the existing options format
        const matchingOptions = addressMatches.map(match => {
          const existingOption = options.find(opt => 
            opt.label.toLowerCase() === match.carparkId.toLowerCase()
          );

          return {
            value: match.carparkId.toLowerCase().replace(/\s+/g, ""),
            label: match.carparkId,
            address: match.address,
            availableLots: existingOption ? existingOption.availableLots : "N/A",
            totalLots: existingOption ? existingOption.totalLots : "N/A",
            location: match.address,
            rates: existingOption ? existingOption.rates : "$2.50/hr",
          };
        });

        setOptions(prevOptions => {
          // Combine the address search results with existing options
          const newOptions = [...matchingOptions];
          prevOptions.forEach(opt => {
            if (!newOptions.find(no => no.value === opt.value)) {
              newOptions.push(opt);
            }
          });
          return newOptions;
        });

      } catch (error) {
        console.error('Error searching by address:', error);
        setErrorMessage('❌ Error searching by address. Please try again.');
        setShowTable(false);
      }
    }
  };

  // Filter options based on the search term
  const filteredOptions = isSearchingByAddress
    ? options.filter(option => addressResults.some(result => result.carparkId === option.label) && option.availableLots !== "N/A")
    : options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  // Pagination logic
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <BrowseCarparkUI
      searchTerm={searchTerm}
      handleInputChange={handleInputChange}
      handleKeyPress={handleKeyPress}
      filteredOptions={paginatedOptions}
      handleChange={handleChange}
      showTable={showTable}
      errorMessage={errorMessage}
      currentPage={currentPage}
      totalPages={totalPages}
      handleNextPage={handleNextPage}
      handlePreviousPage={handlePreviousPage}
      isSearchingByAddress={isSearchingByAddress}
    />
  );
};

export default BrowseCarparkController;