import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavigationMenu from '../components/NavigationMenu';
import "../../styles/CarparkDetails.css";

function CarparkDetails() {
  const { carparkName } = useParams();
  const navigate = useNavigate();
  const [carparkData, setCarparkData] = useState(null);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const matchedCarpark = storedBookings.find(
      (item) => item.carpark.toLowerCase().replace(/\s+/g, '') === carparkName.toLowerCase()
    );
    setCarparkData(matchedCarpark);
    console.log('Loaded data for:', carparkName);
  }, [carparkName]);

  if (!carparkData) {
    return <p>Loading carpark details...</p>;
  }

  const capacityPercentage = Math.floor(
    (carparkData.slotsAvailable / (carparkData.slotsAvailable + carparkData.slotsReserved)) * 100
  );

  const availabilityColor = carparkData.slotsAvailable < 20 
    ? 'red' 
    : carparkData.slotsAvailable < 50 
    ? 'orange' 
    : 'green';

  return (
    <div className="carpark-details-container">
      <div className="carpark-details">
        <NavigationMenu/>
        <h2>{carparkData.carpark} Details</h2>
        
        {/* Flex container for details and notification */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {/* Left side - Carpark details */}
          <div style={{ flex: '1' }}>
            <p><strong>Location:</strong> {carparkData.location && carparkData.location !== 'Unknown Location' 
              ? carparkData.location 
              : 'Address information not available'}
            </p>
            <p style={{ color: availabilityColor }}>
              <strong>Available Lots:</strong> {carparkData.slotsAvailable}/{carparkData.slotsAvailable + carparkData.slotsReserved}
            </p>
            <p><strong>Hourly Rate:</strong> {carparkData.rate || carparkData.rates || '$2.40'}</p>
          </div>
          
          {/* Right side - Notification box */}
          <div style={{ 
            flex: '1',
            border: '2px solid #000',
            borderRadius: '5px',
            padding: '10px',
            marginLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{ 
              textAlign: 'center', 
              margin: '0' 
            }}>
              Upon booking, a 30-minute allowance will be given for you to arrive at the reserved lot, otherwise the lot will be released for others to reserve.
            </p>
            <p style={{ 
              textAlign: 'center', 
              margin: '10px 0 0 0',
              fontWeight: 'bold' 
            }}>
              Please click on the "Book Now" button below to reserve your slot.
            </p>
          </div>
        </div>

        {/* Capacity Bar */}
        <div style={{ marginTop: '20px' }}>
          <h3>Current Capacity</h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '5px',
            overflow: 'hidden',
            backgroundColor: '#e0e0e0',
            height: '30px',
            width: '100%',
          }}>
            <div style={{
              width: `${capacityPercentage}%`,
              backgroundColor: capacityPercentage < 30 ? '#f5a623' : '#7ed321',
              height: '100%',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              lineHeight: '30px',
            }}>
              {capacityPercentage}%
            </div>
            <div style={{
              width: `${100 - capacityPercentage}%`,
              backgroundColor: '#808080',
              height: '100%',
            }}></div>
          </div>
        </div>

        <button
          style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            borderRadius: '5px', 
            borderColor: '#007bff', 
            cursor: 'pointer',
            width: '10%' 
          }}
          onClick={() => navigate(`/booking/${carparkName}`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default CarparkDetails;