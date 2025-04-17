export class Carpark {
  constructor() {
    this.carparks = [];  // This will hold the carpark data
  }

  // Method to fetch carpark data from the HDB API
  async fetchCarparkData() {
    try {
      const response = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Carpark data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Fetch error: ', error);
      return null;
    }
  }

  // Method to load carpark data and store it in the instance
  async loadCarparkData() {
    const carparkData = await this.fetchCarparkData();
    
    if (carparkData && carparkData.items) {
      this.carparks = carparkData.items[0].carpark_data.map(carpark => {
        return carpark.carpark_info.map(info => ({
          carparkNumber: carpark.carpark_number,
          lotType: info.lot_type,
          totalLots: info.total_lots,
          availableLots: info.lots_available,
          lastUpdated: carpark.update_datetime,
        }));
      }).flat();
      console.log('Carpark data loaded into Carpark object.', this.carparks);
    } else {
      console.error('No carpark data available.');
    }
  }

  // Method to get all carpark data (or filter as needed)
  getCarparks() {
    return this.carparks;
  }

  // Example of a method to get available carparks (optional)
  getAvailableCarparks() {
    return this.carparks.filter(carpark => carpark.availableLots > 0);
  }

  // List of carparks with pagination
  getPaginatedCarparks(page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    return this.carparks.slice(startIndex, startIndex + limit);
  }
}
