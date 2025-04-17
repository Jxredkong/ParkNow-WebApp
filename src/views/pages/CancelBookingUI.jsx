import "../../styles/CancelBooking.css";
function CancelBookingUI({ booking, error, handleCancelBooking }){
    return(
        <div className = "bg">
           <div className = "MainBox">
               <h2 className = "CancelHeader">Cancel Booking</h2>
               {error && <p className = "error">{error}</p>}
               <div className = "CancelParas">
                   <p><strong>Carpark:</strong> {booking?.carpark || "Loading..."}</p>
                   <p><strong>Status:</strong> {booking?.status || "Loading..."}</p>
               </div>
               <button className = "CancelButton" onClick={handleCancelBooking} disabled={!booking}>
                 Cancel Booking
               </button>
           </div>
          </div>
       )
}
export default CancelBookingUI;