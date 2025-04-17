// /services/carparkService.js

export async function fetchCarparkData() {
    try {
      const response = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  }
  
  export async function loadCarparkData() {
    const carparkData = await fetchCarparkData();
    
    if (carparkData && carparkData.items) {
      const parsedData = carparkData.items[0].carpark_data.map(carpark => {
        return carpark.carpark_info.map(info => ({
          carparkNumber: carpark.carpark_number,
          lotType: info.lot_type,
          totalLots: info.total_lots,
          availableLots: info.lots_available,
          lastUpdated: carpark.update_datetime,
        }));
      }).flat();
  
      localStorage.setItem('carparkData', JSON.stringify(parsedData));
      console.log('Carpark data loaded and stored locally.');
      return parsedData;
    } else {
      console.error('No carpark data available.');
    }
  }
  
  export async function fetchCarparksByAddress(searchAddress) {
    try {
      const datasetId = "d_23f946fa557947f93a8043bbef41dd09";
      
      const queryParam = encodeURIComponent(searchAddress);
      const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${datasetId}&q=${queryParam}&limit=100`;
      
      console.log("Fetching data with query:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch carpark address data');
      }
      
      const data = await response.json();
      if (!data.result || !data.result.records) {
        throw new Error('Invalid data format received');
      }

      console.log(`API query returned ${data.result.records.length} records`);
      
      // If no results from direct query, try fetching without query for debugging
      if (data.result.records.length === 0) {
        console.log("No records found with direct query, trying general search...");
        
        // Try a general fetch with large limit for debugging
        const generalUrl = `https://data.gov.sg/api/action/datastore_search?resource_id=${datasetId}&limit=500`;
        const generalResponse = await fetch(generalUrl);
        const generalData = await generalResponse.json();
        
        console.log(`General query returned ${generalData.result.records.length} records`);
        
        // Check if target areas exist in the dataset
        const searchUpperCase = searchAddress.toUpperCase();
        const directMatches = generalData.result.records.filter(record => 
          record.address && record.address.toUpperCase().includes(searchUpperCase)
        );
        
        console.log(`Found ${directMatches.length} direct matches for "${searchUpperCase}" in general data`);
        if (directMatches.length > 0) {
          console.log("Direct match samples:", directMatches.slice(0, 3).map(r => r.address));
        }
        
        // Try other variations of the search term
        const variations = [
          searchAddress.toUpperCase(), 
          searchAddress.toLowerCase(),
          "BLK " + searchAddress.toUpperCase(),
          searchAddress.toUpperCase() + " AVE"
        ];
        
        variations.forEach(variation => {
          const varMatches = generalData.result.records.filter(record => 
            record.address && record.address.includes(variation)
          );
          console.log(`Variation "${variation}" found ${varMatches.length} matches`);
          if (varMatches.length > 0) {
            console.log("Sample:", varMatches[0].address);
          }
        });
      }
      
      // Process and return the records from the original query
      let matchingCarparks = data.result.records;
      
      // If direct query didn't work, try manual filtering
      if (matchingCarparks.length === 0) {
        // Fall back to previous approach - fetch all and filter client-side
        const fallbackUrl = `https://data.gov.sg/api/action/datastore_search?resource_id=${datasetId}&limit=10000`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        if (!fallbackData.result || !fallbackData.result.records) {
          throw new Error('Invalid fallback data format received');
        }
        
        const searchTerms = searchAddress.toLowerCase().split(' ');
        matchingCarparks = fallbackData.result.records.filter(carpark => {
          if (!carpark.address) return false;
          
          const address = carpark.address.toLowerCase();
          return searchTerms.some(term => {
            const trimmedTerm = term.trim();
            return trimmedTerm && address.includes(trimmedTerm);
          });
        });
        
        console.log(`Fallback filtering found ${matchingCarparks.length} matches`);
      }

      return matchingCarparks.map(carpark => ({
        carparkId: carpark.car_park_no,
        address: carpark.address,
        xCoord: carpark.x_coord,
        yCoord: carpark.y_coord
      }));
    } catch (error) {
      console.error('Error fetching carpark address data:', error);
      throw error;
    }
  }
  