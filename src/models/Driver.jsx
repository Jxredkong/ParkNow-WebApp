class Driver {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.bookedCarparks = []; // Array to store bookings
    }

    getUsername() { return this.username; }
    setUsername(username) { this.username = username; }

    getPassword() { return this.password; }
    setPassword(password) { this.password = password; }

    getBookedCarparks() { return this.bookedCarparks; }
    addBooking(booking) { this.bookedCarparks.push(booking); }
    removeBooking(bookingId) {
        this.bookedCarparks = this.bookedCarparks.filter(booking => booking.id !== bookingId);
    }
}

export default Driver;