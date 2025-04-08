export const APP_CONFIG = {
  webscene: {
    portalItem: {
      id: 'b6662d6616564a1284a5d7835137a493'
    },
    layers: {
      groups: {
        hourly: {
          title: "Hourly"
        },
        monthly: {
          title: "Monthly"
        },
        daily: {
          title: "Daily"
        }
      },
      NO2: {
        hourly: {
          title: "NO2 Hourly"
        },
        monthly: {
          title: "NO2 Monthly"
        },
        daily: {
          title: "NO2 Daily"
        }
      },
      HCHO: {
        hourly: {
          title: "HCHO Hourly"
        },
        monthly: {
          title: "HCHO Monthly"
        },
        daily: {
          title: "HCHO Daily"
        }
      }
    }
  },
  defaultState: {
    variable: 'NO2',
    year: new Date().getFullYear(),
    date: new Date(),
    view: {
      // Default view settings from legacy app
      center: [-95, 40],
      zoom: 3,
      rotation: 0
    }
  },
  api: {
    // API endpoints and configuration
    baseUrl: 'your_api_endpoint',
    // ... other API settings
  }
}; 