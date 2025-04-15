/**
 * Consolidated Application Configuration
 * Reorganized for clarity.
 */
export const APP_CONFIG = {

  // ========================================================================
  // 1. General Application Settings
  // ========================================================================
  general: {
    // Default state values when the application loads
    defaultState: {
      variable: 'NO2', // Default variable selected ('NO2' or 'HCHO') - src/config/appConfig.js:L43 | src/App.js:L15
      year: new Date().getFullYear(), // Default year selected - src/config/appConfig.js:L44 | src/App.js:L20
      date: new Date(2024, 8, 21), // Default specific date selected - src/config/appConfig.js:L45 | src/App.js:L10
      view: {
        center: [-74.0060, 40.7128], // src/config/appConfig.js:L48 | src/App.js:L12 | src/components/Map/MapView.jsx:L687
        zoom: 10, // src/config/appConfig.js:L49
        rotation: 0 // src/config/appConfig.js:L50
      }
    },
    // Number of years to show back from current year in the year selector dropdown
    yearSelectorRange: 5, // src/App.js:L242
    // Delay in milliseconds for the HCHO demo fetch (likely for debugging, consider removing for production)
    hchoDemoFetchDelayMs: 5000, // src/components/Map/MapView.jsx:L701
    // API endpoint configuration (placeholder)
    api: {
      baseUrl: 'your_api_endpoint', // src/config/appConfig.js:L54
      // ... other API settings
    },
    // --- UI Theme & Appearance ---
    // Contains settings related to the visual appearance (colors, icons)
    ui: {
      // Color theme definition
      theme: {
        backgroundPrimary: '#1C243B', // src/App.js:L213, L234, L249, L258, L267, L276 | src/components/Charts/HourlyChart.jsx:L41 | src/components/Charts/MonthlyChart.jsx:L41 | src/components/Map/MapView.jsx:L29, L519, L527, L546, L587
        backgroundSecondary: '#222C49', // src/App.js:L310 | src/components/Charts/DailyChart.jsx:L75
        accent: '#C77A41', // src/App.js:L217, L298, L301 | src/components/Charts/HourlyChart.jsx:L42 | src/components/Charts/MonthlyChart.jsx:L42 | src/components/Map/MapView.jsx:L461 | src/components/Map/MapView.jsx:L278
        border: '#666666', // src/App.js:L238, L307 | src/components/Charts/HourlyChart.jsx:L53, L68 | src/components/Charts/MonthlyChart.jsx:L53, L68
        text: '#efefef', // src/App.js:L227, L235, L289, L302, L319, L326 | src/components/Charts/DailyChart.jsx:L11 | src/components/Charts/HourlyChart.jsx:L30, L38, L56, L64, L71 | src/components/Charts/MonthlyChart.jsx:L30, L38, L56, L64, L71 | src/components/Map/MapView.jsx:L32, L461, L520, L528, L547, L562, L588
        chartLineSecondary: '#666666', // src/components/Map/MapView.jsx:L278
        chartMovingAverage: '#00ff00' // src/components/Map/MapView.jsx:L340
      },
      // Icons used in the UI
      icons: {
        yearSelector: {
          first: "⏮", // src/App.js:L386
          previous: "◀", // src/App.js:L391
          next: "▶", // src/App.js:L401
          last: "⏭" // src/App.js:L406
        },
        mapZoom: {
          zoomIn: '+', // src/components/Map/MapView.jsx:L545
          zoomOut: '-' // src/components/Map/MapView.jsx:L545
        }
      }
    },
    // --- General UI Text Strings ---
    // Contains non-variable-dependent text strings used across the application
    text: {
      buttons: {
        howTo: "How to", // src/App.js:L306
        // Add other general button text here
      },
      labels: {
        date: "Date:", // src/App.js:L371
        location: "Location:", // src/App.js:L376
        value: "Value:", // src/App.js:L400, L460
      },
      status: {
        loadingInitialData: "Loading initial data...", // src/App.js:L402
        noLocationSelected: "No location selected", // src/App.js:L360
        noDateSelected: "No date selected", // src/App.js:L364
      },
    },
    // --- Testing Configuration ---
    testing: {
      // Test data mode: "off", "random", or a pattern name like "pattern1"
      hourlyTestMode: "pattern1",
      monthlyTestMode: "pattern1",
      dailyTestMode: "seasonal",
      
      // Test data configuration for random generation
      randomData: {
        // Random data generation ranges
        hourlyValueRange: [0, 10],  // Min/max values for hourly data
        dailyValueRange: [0, 300],  // Min/max values for daily data
        monthlyValueRange: [0, 10], // Min/max values for monthly data
        // Seed for random number generation (for consistent test data)
        randomSeed: 12345
      }
    }
  },

  // ========================================================================
  // 2. Variable Definitions
  // ========================================================================
  // Contains all settings specific to each chemical variable (NO2, HCHO)
  variables: {
    // --- Nitrogen Dioxide Settings ---
    NO2: {
      displayName: "NO2", // Used for UI elements like buttons and chart titles
      attributeName: 'NO2_Troposphere', // Name used in service attributes - src/config/variables.js:L3 | src/components/Map/MapView.jsx:L123, L181, L441
      units: 'ppb', // Units for display - src/config/variables.js:L7 | src/App.js:L28
      // Function to process raw value from service (if needed, seems unused currently) - src/config/variables.js:L8
      postProcess: (value) => value / 1000000000000,
      // Conversion factor used in MapView.jsx getSamples - src/components/Map/MapView.jsx:L127, L185, L448
      conversionFactor: 1e-14,
      // Layer titles specific to this variable
      layers: {
        hourly: "NO2 Hourly", // src/config/appConfig.js:L20 | src/config/variables.js:L4, L5 | src/components/Map/MapView.jsx:L111, L604, L626
        monthly: "NO2 Monthly", // src/config/appConfig.js:L23 | src/components/Map/MapView.jsx:L370
        daily: "NO2 Daily" // src/config/appConfig.js:L26 | src/config/variables.js:L6 | src/components/Map/MapView.jsx:L431
      },
      // Chart settings specific to this variable
      chartSettings: {
        monthlyColor: '#C77A41', // src/components/Map/MapView.jsx:L415
        // Daily chart (heatmap) color ramp
        dailyColorStart: [189, 175, 129, 255], // src/components/Charts/DailyChart.jsx:L68
        dailyColorEnd: [37, 11, 47, 255], // src/components/Charts/DailyChart.jsx:L69
        // Add other variable-specific chart settings here if needed
      },
      // Title used in the map legend - src/components/Map/MapView.jsx:L39
      legendTitle: 'NO2 (ppb)',
      // Min/Max values (potentially for chart scales or color ramps)
      min: 0, // src/config/variables.js:L9
      max: 10, // src/config/variables.js:L10
    },
    // --- Formaldehyde Settings ---
    HCHO: {
      displayName: "HCHO", // Used for UI elements like buttons and chart titles
      attributeName: 'HCHO', // Name used in service attributes - src/config/variables.js:L12 | src/components/Map/MapView.jsx:L123, L181, L388, L441 | src/components/Map/MapView.jsx:L699
      units: 'ppt', // Units for display - src/config/variables.js:L16 | src/App.js:L28
      // Function to process raw value from service (if needed, seems unused currently) - src/config/variables.js:L17
      postProcess: (value) => value / 1000000000,
      // Conversion factor used in MapView.jsx getSamples - src/components/Map/MapView.jsx:L128, L186, L394, L448 | src/components/Map/MapView.jsx:L709
      conversionFactor: 1e-17,
      // Layer titles specific to this variable
      layers: {
        hourly: "HCHO Hourly", // src/config/appConfig.js:L31 | src/config/variables.js:L13, L14 | src/components/Map/MapView.jsx:L111, L604, L626
        monthly: "HCHO Monthly", // src/config/appConfig.js:L34 | src/components/Map/MapView.jsx:L370
        daily: "HCHO Daily" // src/config/appConfig.js:L37 | src/config/variables.js:L15 | src/components/Map/MapView.jsx:L431 | src/components/Map/MapView.jsx:L680
      },
      // Chart settings specific to this variable
      chartSettings: {
        monthlyColor: '#63ABBB', // src/components/Map/MapView.jsx:L415
        // Daily chart (heatmap) color ramp (Example: using a blue ramp)
        dailyColorStart: [222, 235, 247, 255], // Light Blue
        dailyColorEnd: [49, 130, 189, 255],   // Dark Blue
        // Add other variable-specific chart settings here if needed
      },
      // Title used in the map legend - src/components/Map/MapView.jsx:L39
      legendTitle: 'HCHO (ppt)',
      // Min/Max values
      min: 0, // src/config/variables.js:L18
      max: 10, // src/config/variables.js:L19
    }
    // Add more variables here following the same structure
  },

  // ========================================================================
  // 3. Component Settings
  // ========================================================================
  // Contains settings specific to individual UI components (Map, Charts)
  components: {
    // --- Map Component Settings ---
    map: {
      // ID of the ArcGIS Online WebScene item to load
      websceneId: 'b6662d6616564a1284a5d7835137a493', // src/config/appConfig.js:L4 | src/hooks/useMapView.js:L13
      // Tolerance for map click identify operations (in screen pixels)
      identifyTolerance: 2, // src/components/Map/MapView.jsx:L70
      // General titles for layer groups in the WebScene (used to find the groups)
      layerGroupTitles: {
        hourly: "Hourly", // src/config/appConfig.js:L9 | src/components/Map/MapView.jsx:L648
        monthly: "Monthly", // src/config/appConfig.js:L12 | src/components/Map/MapView.jsx:L652
        daily: "Daily" // src/config/appConfig.js:L15 | src/components/Map/MapView.jsx:L656
      },
      // Text strings specific to the map component
      text: {
        status: {
          loadingIndicator: "Loading...", // src/components/Map/MapView.jsx:L589
        },
        attribution: 'Esri, TomTom, FAO, NOAA, USGS | The products are generated by the Science Data Processing Center (SDPC)', // src/components/Map/MapView.jsx:L563
      }
      // Note: Variable-specific layer titles are now under variables[VAR].layers
    },
    // --- Chart Component Settings ---
    charts: {
      // Settings specific to the Hourly Chart
      hourly: {
        // Range for moving average calculation (total hours, e.g., 1 means ±0.5 hours from center)
        movingAverageHoursRange: 1, // src/components/Map/MapView.jsx:L211 | src/App.js:L23
        // Date range offset (days before/after selected date) for data fetch
        dataFetchDaysRange: 3, // src/components/Map/MapView.jsx:L168, L172
        // Text strings specific to the hourly chart
        text: {
          // Title template (use `${variable}` for dynamic variable name)
          title: "Hourly ${variable} Values", // src/components/Charts/HourlyChart.jsx:L36
          legend: {
            // Legend label template (use `${range}` for dynamic range)
            movingAverage: "${range}hr Moving Average" // src/components/Map/MapView.jsx:L339
          },
        }
      },
      // Settings specific to the Daily Chart (Heatmap)
      daily: {
        // Note: colorStart and colorEnd moved to variables[VAR].chartSettings
        valueMax: 300, // Max value used for color scaling - src/components/Charts/DailyChart.jsx:L70
        weekLabelInterval: 5, // How often to show week number labels - src/components/Charts/DailyChart.jsx:L93
        dayLabelWidthPx: 20, // Fixed width for day labels column - src/components/Charts/DailyChart.jsx:L5
        paddingRightPx: 20, // Right padding for the chart grid - src/components/Charts/DailyChart.jsx:L4
        dayAbbreviations: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], // src/components/Charts/DailyChart.jsx:L65
        // Text strings specific to the daily chart
        text: {
          // Title template (use `${variable}` for dynamic variable name)
          title: "Daily ${variable} Values", // src/components/Charts/DailyChart.jsx:L156
          tooltips: {
            noData: "No data available", // src/components/Charts/DailyChart.jsx:L146
          },
        }
      },
      // Settings specific to the Monthly Chart
      monthly: {
        // Add any non-text monthly chart settings here if needed
        // Text strings specific to the monthly chart
        text: {
          // Title template (use `${variable}` for dynamic variable name)
          title: "Monthly ${variable} Values", // src/components/Charts/MonthlyChart.jsx:L36
        }
      },
      // Common settings for multiple charts
      common: {
        fallbackYAxisTitle: 'Value', // Fallback Y-axis title if units are not defined - src/components/Charts/HourlyChart.jsx:L63 | src/components/Charts/MonthlyChart.jsx:L63
        valuePrecision: 2, // Number of decimal places for displaying values - src/components/Map/MapView.jsx:L81, L134 | src/components/Charts/DailyChart.jsx:L145
        monthAbbreviations: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // src/components/Map/MapView.jsx:L408
      }
    }
    // Add settings for other components here if needed
  },

  // ========================================================================
  // 4. UI Theme & Appearance (MOVED TO general.ui)
  // ========================================================================
  // ui: { ... } // This section is now removed

  // ========================================================================
  // 5. UI Text Strings (MOVED TO general.text and components.*.text)
  // ========================================================================
  // text: { ... } // This section is now removed
}; 