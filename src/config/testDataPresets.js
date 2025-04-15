/**
 * Predetermined Test Data Presets
 * 
 * This file contains predefined data patterns for testing chart components.
 * These patterns can be selected in appConfig.js by setting:
 * - testing.useTestData = true
 * - testing.usePresetData = true
 * - testing.presetDataKey = 'pattern1' (or other pattern name)
 */

// Hourly data presets (7 days x 24 hours)
export const HOURLY_DATA_PRESETS = {
  // Bell curve pattern with peak at noon
  pattern1: [
    // 24 hours of data for 7 days (3 days before, selected day, 3 days after)
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], // Day -3
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Day -2
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2], // Day -1
    [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3], // Selected day
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2], // Day +1
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Day +2
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]  // Day +3
  ],
  
  // Morning and evening peaks (commute pattern)
  pattern2: [
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1],
    [1, 0, 0, 0, 1, 3, 7, 9, 6, 4, 3, 2, 3, 4, 5, 6, 8, 9, 7, 5, 3, 2, 1, 1]
  ],
  
  // Flat morning, peak afternoon (solar-driven pattern)
  pattern3: [
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 2, 2]
  ],
  
  // Weekend vs weekday pattern
  pattern4: [
    [1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1], // Sunday
    [1, 1, 1, 1, 2, 4, 7, 8, 7, 6, 5, 6, 7, 8, 7, 6, 8, 7, 5, 4, 3, 2, 1, 1], // Monday
    [1, 1, 1, 1, 2, 4, 7, 8, 7, 6, 5, 6, 7, 8, 7, 6, 8, 7, 5, 4, 3, 2, 1, 1], // Tuesday
    [1, 1, 1, 1, 2, 4, 7, 8, 7, 6, 5, 6, 7, 8, 7, 6, 8, 7, 5, 4, 3, 2, 1, 1], // Wednesday
    [1, 1, 1, 1, 2, 4, 7, 8, 7, 6, 5, 6, 7, 8, 7, 6, 8, 7, 5, 4, 3, 2, 1, 1], // Thursday
    [1, 1, 1, 1, 2, 4, 7, 8, 7, 6, 5, 6, 7, 8, 7, 6, 8, 7, 5, 4, 3, 2, 1, 1], // Friday
    [2, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1]  // Saturday
  ]
};

// Monthly data presets (12 months)
export const MONTHLY_DATA_PRESETS = {
  // Seasonal pattern with summer peak
  pattern1: [3, 3.5, 4, 5, 6.5, 8, 9, 8.5, 7, 5.5, 4, 3.5],
  
  // Winter peak pattern
  pattern2: [9, 8, 7, 6, 5, 4, 3, 4, 5, 6, 7, 8],
  
  // Bimodal pattern (spring and fall peaks)
  pattern3: [3, 4, 7, 8, 6, 4, 3, 4, 6, 8, 7, 4]
};

// Daily data presets (53 weeks x 7 days)
// This would be a large array, so we'll just define a function to generate patterns
export const generateDailyDataPattern = (patternType) => {
  // Create a 53x7 array
  const data = Array(53).fill().map(() => Array(7).fill(0));
  
  switch (patternType) {
    case 'seasonal':
      // Create a seasonal pattern with summer peak
      for (let week = 0; week < 53; week++) {
        const seasonalFactor = Math.sin((week / 52) * Math.PI * 2) * 150 + 150; // 0-300 range
        for (let day = 0; day < 7; day++) {
          // Weekend vs weekday variation
          const dayFactor = (day === 0 || day === 6) ? 0.7 : 1.0;
          data[week][day] = seasonalFactor * dayFactor;
        }
      }
      break;
      
    case 'weekday':
      // Create a pattern with strong weekday/weekend difference
      for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
          // Weekend vs weekday variation (much stronger)
          data[week][day] = (day === 0 || day === 6) ? 50 : 200;
        }
      }
      break;
      
    case 'random':
    default:
      // Random pattern with some structure
      for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
          data[week][day] = Math.random() * 300;
        }
      }
  }
  
  return data;
}; 