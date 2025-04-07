export const VARIABLES = {
  NO2: {
    name: 'NO2_Troposphere',
    groupLayer: 'NO2 Hourly',
    layer: 'NO2 Hourly',
    dailyLayer: 'NO2 Daily',
    units: 'ppb',
    postProcess: (value) => value / 1000000000000, // Convert to ppb
    min: 0,
    max: 10
  },
  HCHO: {
    name: 'HCHO',
    groupLayer: 'HCHO Hourly',
    layer: 'HCHO Hourly',
    dailyLayer: 'HCHO Daily',
    units: 'ppt',
    postProcess: (value) => value / 1000000000, // Convert to ppt
    min: 0,
    max: 10
  }
}; 