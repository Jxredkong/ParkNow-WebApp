import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { CarparkProvider } from "./context/CarparkContext"; // Import the CarparkProvider
import Authenticator from "./controllers/Authenticator";
import Home from "./views/pages/Home";
import CarparkDetails from "./views/pages/CarparkDetails";
import CheckIn from "./controllers/CheckInController";
import CheckOut from "./controllers/CheckOutController";
import BrowseCarparkController from "./controllers/BrowseCarparkController";
import Booking from "./controllers/BookingController";
import CancelBooking from "./controllers/CancelBookingController";
import Register from "./controllers/Register";
import NavigationMenu from "./views/components/NavigationMenu";

function App() {
  return (
    <CarparkProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Authenticator />} />
            <Route path="/home" element={<Home />} />
            <Route path="/carpark/:carparkName" element={<CarparkDetails />} />
            <Route path="/booking/:carparkName" element={<Booking />} />
            <Route path="/cancelbooking/:bookingId" element={<CancelBooking />} />
            <Route path="/checkin/:bookingId" element={<CheckIn />} />
            <Route path="/checkout/:bookingId" element={<CheckOut />} />
            <Route path="/login/register" element={<Register />} />
            <Route path="/browse-carpark" element={<BrowseCarparkController />} />
          </Routes>
        </div>
      </Router>
    </CarparkProvider>
  );
}

export default App;