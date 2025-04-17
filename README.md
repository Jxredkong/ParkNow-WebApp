# ParkNow App

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contents

1.  [Purpose](#purpose)
2.  [Expected Audience](#expected-audience)
3.  [Novelty](#novelty)
4.  [Key Features and Functionalities](#key-features-and-functionalities)
5.  [Setup Instructions](#setup-instructions)
6.  [APIs Used](#apis-used)
7.  [System Design Patterns/Principles Used](#system-design-patterns-principles-used)

## 1. Purpose <a name="purpose"></a>

ParkNow is a mobile-first web application designed to simplify the process of finding and booking available parking spaces in Singapore. It aims to provide users with real-time carpark availability information and a seamless booking experience, reducing the stress and time associated with parking.

## 2. Expected Audience <a name="expected-audience"></a>

The primary audience for ParkNow includes:

* Drivers in Singapore seeking convenient parking options.
* Residents and visitors needing short-term or pre-booked parking.
* Individuals who value efficiency and want to avoid the hassle of searching for parking.

## 3. Novelty <a name="novelty"></a>

ParkNow aims to stand out by:

* Providing a user-friendly and intuitive interface focused on speed and efficiency.
* Integrating real-time availability data with a direct booking system.
* Potentially incorporating smart features like personalized parking recommendations based on user history and location (future enhancement).

## 4. Key Features and Functionalities <a name="key-features-and-functionalities"></a>

* **Real-time Carpark Availability:** Displays up-to-the-minute real time parking lot availability across Singapore.
* **Carpark Browsing:** Allows users to browse carparks by location, rates, of interest.
* **Booking System:** Enables users to select a carpark, date, and time to book a parking slot.
* **User Authentication:** Secure registration and login with HTTPS encrypted passwords.
* **Cancellation Feature:** Ability to cancel bookings within a defined timeframe.

## 5. Setup Instructions <a name="setup-instructions"></a>

## Prerequisites
1. Ensure you have **Node.js** installed on your system. You can download it from [Node.js Official Website](https://nodejs.org/).
2. Install a package manager like **npm** (comes with Node.js) or **yarn**.

## Steps to Set Up the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/huegashi/ParkNow.git
   cd my-app
   ```

2. **Install Dependencies**
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Ensure you have access to the required APIs:
     - `https://api.data.gov.sg/v1/transport/carpark-availability`
     - `https://data.gov.sg/api/action/datastore_search`

4. **Run the Application**
   Start the development server:
   ```bash
   npm start
   ```

5. **Testing the Application**
   - Open your browser and navigate to `http://localhost:3000` (or the port specified in your project).
   - Verify that carpark data is fetched and displayed correctly.

6. **Debugging**
   - Debug logs are available in the browser console for:
     - Fetched carpark availability data.
     - Raw and parsed carpark data.
   - Check for any errors in the console if the application does not behave as expected.

7. **Build for Production**
   To create a production build, run:
   ```bash
   npm run build
   ```

8. **Optional: Run Tests**
   If tests are available, you can run them using:
   ```bash
   npm test
   ```

## Notes
- Ensure your browser allows access to the APIs mentioned above.
- If you encounter issues with localStorage, clear your browser's localStorage and try again.


8.  **Access the application:** Open your web browser and navigate to the address where the frontend is served (usually `http://localhost:3000`).

## 6. APIs Used <a name="apis-used"></a>

* **Supabase:** For user authentication and registration.
* **Data.gov.sg APIs:** Carpark Availability API and Carpark Information.

## 7. System Design Patterns/Principles Used <a name="system-design-patterns-principles-used"></a>
### Modularity

The application exhibits high modularity by separating concerns into distinct components and controllers. Each function within the 3-layered architecture (Presentation: CSS + UIs, Logic: controllers, Persistent Data) handles specific tasks. For instance, the `Authenticator` manages authentication, while `CheckInController`, `CheckOutController`, and `BrowseCarparkController` handle their respective functionalities. Views like `Home` and `CarparkDetails` are kept separate from the underlying controller logic.

This design choice ensures:

* **Easy feature addition:** New functionalities can be added as independent modules.
* **Reduced regression risk:** Decoupled components minimize the likelihood of changes causing unintended side effects.
* **Parallel development:** Different parts of the application can be worked on concurrently.
* **Maintainability:** Each module can be developed, tested, and maintained in isolation.

### Abstraction

The use of React components abstracts away the complexities of UI rendering. Examples include:

* `<Authenticator />`: Abstracts user authentication logic.
* `<BrowseCarparkController />`: Abstracts the logic for browsing car parks.
* `react-router-dom`: Abstracts navigation logic, allowing developers to focus on route definitions.

This abstraction provides:

* **Flexibility:** Underlying technologies can be changed without affecting the application's core structure.
* **Improved readability and simplicity:** Makes the codebase easier to understand and simplifies future development efforts.

### Open-Closed Principle

The application adheres to the Open-Closed Principle, being open for extension but closed for modification.

* New routes (e.g., `/browse-carpark`) can be added without altering existing route configurations.
* New controllers or views can be introduced without modifying existing ones, provided they adhere to established interfaces.

The addition of `BrowseCarparkController` as a new route, for example, did not necessitate changes to other existing controllers or views. This principle allows for:

* **Addition of features without modification:** Minimizing the risk of introducing bugs into stable code.
* **Future-proofing:** The application can adapt to new requirements and integrate new technologies as independent modules without major rewrites.

### Reusability

Components and controllers are designed for reuse across the application.

* The `Navigation Menu` is utilized in various parts and pages.
* Controllers like `BookingController` and `CancelBookingController` encapsulate specific business logic, making them reusable across different views and routes.
* The routing system (`react-router-dom`) itself is reusable, centralizing navigation logic within `App.jsx`.

This promotes:

* **Faster future development:** By leveraging existing, tested components and logic.
* **Consistent behavior and UI:** Ensuring a uniform user experience throughout the application.
* **Reduced code duplication:** Leading to a more manageable and maintainable codebase.

