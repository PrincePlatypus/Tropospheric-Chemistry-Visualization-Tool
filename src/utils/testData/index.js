import { APP_CONFIG } from '../../config/appConfig';
import { HOURLY_DATA_PRESETS } from '../../config/testDataPresets';

// Generate hourly chart test data
export const generateHourlyTestData = (selectedDate, themeColors) => {
  const { accent, border } = themeColors;
  const testMode = APP_CONFIG.general.testing.hourlyTestMode;
  
  // If test mode is off, return null to indicate no test data
  if (testMode === "off") {
    return null;
  }
  
  // Generate dates for 3 days before and 3 days after selected date
  const dates = Array(7).fill(0).map((_, index) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 3 + index);
    return date;
  });

  // Determine which data to use based on test mode
  let hourlyData;
  
  if (testMode !== "random" && HOURLY_DATA_PRESETS[testMode]) {
    // Use predetermined data if a valid pattern is specified
    hourlyData = HOURLY_DATA_PRESETS[testMode];
  } else {
    // Generate random data for each day
    const [min, max] = APP_CONFIG.general.testing.randomData.hourlyValueRange || [0, 10];
    hourlyData = dates.map(() => 
      Array(24).fill(0).map(() => min + Math.random() * (max - min))
    );
  }

  // Return the raw data for the HourlyChart component to process
  return {
    dates,
    hourlyData,
    themeColors: { accent, border }
  };
};