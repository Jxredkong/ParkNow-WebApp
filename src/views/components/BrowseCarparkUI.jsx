import React from 'react';
import "../../styles/BrowseCarparkUI.css"; // Import a CSS file for better styling

const BrowseCarparkUI = ({ 
  searchTerm, 
  handleInputChange, 
  handleKeyPress, 
  filteredOptions, 
  handleChange, 
  showTable, 
  errorMessage, 
  currentPage, 
  totalPages, 
  handleNextPage, 
  handlePreviousPage,
  isSearchingByAddress
}) => {
  return (
    <div className="browse-carpark-container">
      <div className="browse-carpark-header">
        <p>Search by carpark ID or address</p>
        {/* <p>*Press Enter to search</p> */}
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter carpark ID or address..."
        className="browse-carpark-input"
      />

      {errorMessage && (
        <div className="browse-carpark-error">
          {errorMessage}
        </div>
      )}

      {showTable && filteredOptions.length > 0 && (
        <>
          <div className="browse-carpark-note">
            {isSearchingByAddress && (
              <p>Showing carparks matching the address search</p>
            )}
          </div>
          <table className="browse-carpark-table">
            <thead>
              <tr>
                <th>Carpark ID</th>
                <th>Available Lots</th>
                <th>Location</th>
                <th>Rate</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredOptions.map((option) => (
                <tr key={option.value}>
                  <td>{option.label}</td>
                  <td>{option.availableLots}</td>
                  <td>{option.location}</td>
                  <td>{option.rates}</td>
                  <td>
                    <button 
                      className="select-button" 
                      onClick={() => handleChange(option)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-button"
                onClick={handlePreviousPage} 
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                className="pagination-button"
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseCarparkUI;