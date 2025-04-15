import { useCallback } from 'react';

/**
 * Custom hook to handle data fetching operations for location, date, and variable changes
 * @param {Object} mapViewRef - Reference to the MapView component
 * @returns {Function} fetchData - Function to trigger all necessary data fetches
 */
export const useDataFetching = (mapViewRef) => {
  const fetchData = useCallback((location, date, variable, year) => {
    if (!location || !mapViewRef.current) {
      console.log('📊 useDataFetching: Missing required parameters or mapView not ready');
      return;
    }

    console.log('📊 useDataFetching: Fetching data for:', {
      location,
      date: date?.toISOString(),
      variable,
      year
    });

    // Update map layer time extent
    mapViewRef.current.updateLayerTimeExtent(date);
    
    // Fetch all required data
    mapViewRef.current.fetchLocationData(location, date, variable);
    mapViewRef.current.fetchHourlyRangeData(location, date, variable);
    mapViewRef.current.fetchMonthlyData(location, year, variable);
    mapViewRef.current.fetchDailyData(location, year, variable);
  }, []);

  return fetchData;
}; 