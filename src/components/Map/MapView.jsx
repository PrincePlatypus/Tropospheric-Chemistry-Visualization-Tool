import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';
import Home from "@arcgis/core/widgets/Home";
import Compass from "@arcgis/core/widgets/Compass";
import Legend from "@arcgis/core/widgets/Legend";
import { APP_CONFIG } from '../../config/appConfig';
import Graphic from "@arcgis/core/Graphic";

const MapView = forwardRef(({ 
  onLocationSelect, 
  selectedVariable,
  onViewCreated,
  onPixelValueChange,
  selectedDate,
  selectedYear,
  initialLocation,
  initialDate,
  onHourlyDataUpdate,
  onMonthlyDataUpdate,
  onDailyDataUpdate,
  fetchData,
  selectedLocation
}, ref) => {
  const mapDiv = useRef(null);
  const layersRef = useRef({ 
    hourlyGroup: null,
    monthlyGroup: null,
    dailyGroup: null 
  });
  const viewRef = useRef(null);
  const websceneRef = useRef(null);
  const timestampsRef = useRef([]);
  const locationGraphicRef = useRef(null);

  // Function to create legend
  const createLegend = async (layer) => {
    await layer.load();

    const legendContainer = document.createElement('div');
    legendContainer.style.cssText = `
      position: absolute;
      bottom: 40px;
      right: 10px;
      background-color: rgba(28, 36, 59, 0.9);
      padding: 6px;
      border-radius: 4px;
      color: #efefef;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
    `;

    const legend = new Legend({
      container: legendContainer,
      view: viewRef.current,
      layerInfos: [{
        layer: layer,
        title: selectedVariable === 'NO2' ? 'NO2 (ppb)' : 'HCHO (ppt)'
      }],
      style: {
        type: "classic",
        layout: "horizontal"
      }
    });

    // Custom CSS to override Legend widget styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .esri-legend {
        background-color: transparent !important;
        padding: 0 !important;
      }
      .esri-legend__service {
        padding: 0 !important;
      }
      .esri-legend__layer-caption {
        display: none !important;
      }
      .esri-legend__layer-body {
        margin: 0 !important;
      }
      .esri-legend__layer-cell--symbols {
        width: 150px !important;
      }
      .esri-legend__layer-row {
        font-size: 10px !important;
      }
    `;
    legendContainer.appendChild(styleSheet);

    await legend.when();
    return legendContainer;
  };


  // Function to fetch data for a location
  const fetchLocationData = async (location, date, variable) => {
    const hourlyGroup = layersRef.current.hourlyGroup;
    if (hourlyGroup) {
      const activeLayer = hourlyGroup.layers.find(layer => 
        layer.title === `${variable} Hourly`
      );
      
      if (activeLayer) {
        try {
          // Create UTC dates for the query
          const startOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0, 0, 0, 0
          ));
          
          const endOfDay = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23, 59, 59, 999
          ));

          const response = await activeLayer.getSamples({
            geometry: {
              type: "point",
              longitude: location.longitude,
              latitude: location.latitude,
              spatialReference: { wkid: 4326 }
            },
            timeExtent: {
              start: startOfDay,
              end: endOfDay
            },
            returnFirstValueOnly: false
          });

          if (response?.samples) {
            const dataAtLocation = response.samples.reduce((infos, sample) => {
              const attributeName = variable === 'NO2' ? 'NO2_Troposphere' : 'HCHO';
              const rawValue = sample.attributes[attributeName];
              const scientificValue = Number(rawValue).toExponential();
              
              const convertedValue = variable === 'NO2'
                ? Number(scientificValue) * 1e-12
                : Number(scientificValue) * 1e-12;
              
              return infos.concat({
                date: new Date(sample.attributes.StdTime),
                rawValue: Number(rawValue),
                value: convertedValue
              });
            }, []);

            // Find the highest value
            const highestSample = dataAtLocation.reduce((highest, current) => {
              return current.rawValue > highest.rawValue ? current : highest;
            }, dataAtLocation[0]);

            if (highestSample) {
              onPixelValueChange(highestSample.value);
            }
          }
        } catch (error) {
          console.error('Error getting sample:', error);
          onPixelValueChange(null);
        }
      }
    }
  };

  // Add this new function
  const fetchHourlyRangeData = async (location, date, variable) => {
    const hourlyGroup = layersRef.current.hourlyGroup;
    if (hourlyGroup) {
      const activeLayer = hourlyGroup.layers.find(layer => 
        layer.title === `${variable} Hourly`
      );
      
      if (activeLayer) {
        try {
          // Create UTC dates for 3 days before and 3 days after
          const startDate = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() - APP_CONFIG.components.charts.hourly.dataFetchDaysRange,
            0, 0, 0, 0
          ));
          
          const endDate = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + APP_CONFIG.components.charts.hourly.dataFetchDaysRange,
            23, 59, 59, 999
          ));

          const response = await activeLayer.getSamples({
            geometry: {
              type: "point",
              longitude: location.longitude,
              latitude: location.latitude,
              spatialReference: { wkid: 4326 }
            },
            timeExtent: {
              start: startDate,
              end: endDate
            },
            returnFirstValueOnly: false
          });

          if (response?.samples && response.samples.length > 0) {
            // Store available timestamps
            timestampsRef.current = response.samples
              .map(sample => sample.attributes.StdTime)
              .sort((a, b) => a - b);

            const hourlyData = response.samples.reduce((infos, sample) => {
              const attributeName = variable === 'NO2' ? 'NO2_Troposphere' : 'HCHO';
              const rawValue = sample.attributes[attributeName];
              const scientificValue = Number(rawValue).toExponential();
              
              const convertedValue = variable === 'NO2'
                ? Number(scientificValue) * 1e-12
                : Number(scientificValue) * 1e-12;
              
              // Only include positive values
              if (convertedValue > 0) {
                return infos.concat({
                  date: new Date(sample.attributes.StdTime),
                  value: convertedValue
                });
              }
              return infos;  // Skip non-positive values
            }, []);

            // Sort by date
            hourlyData.sort((a, b) => a.date - b.date);
            
            // Guard against empty data
            if (hourlyData.length === 0) {
              onHourlyDataUpdate([]);
              return;
            }
            
            // Group data by day
            const groupedByDay = hourlyData.reduce((acc, item) => {
              const day = item.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              });
              if (!acc[day]) {
                acc[day] = [];
              }
              // Store exact hour with minutes
              acc[day].push({
                exactTime: `${item.date.getHours().toString().padStart(2, '0')}:${item.date.getMinutes().toString().padStart(2, '0')}`,
                value: item.value
              });
              return acc;
            }, {});

            // Calculate moving average for each hour
            const calculateMovingAverage = (hour, allValues) => {
              const HOURS_RANGE = APP_CONFIG.components.charts.hourly.movingAverageHoursRange;
              let sum = 0;
              let count = 0;

              // Collect all values within the range for all days
              allValues.forEach(value => {
                const valueHour = parseInt(value.exactTime.split(':')[0]);
                const hourDiff = Math.abs(valueHour - hour);
                
                // Check if the hour is within range (considering day wrap)
                if (hourDiff <= HOURS_RANGE || 24 - hourDiff <= HOURS_RANGE) {
                  sum += parseFloat(value.value);
                  count++;
                }
              });

              return count > 0 ? sum / count : null;
            };

            // Get all values across all days
            const allValues = Object.values(groupedByDay).flat();

            // Calculate moving average for each hour
            const movingAverages = Array(24).fill(0).map((_, hour) => ({
              x: `${hour.toString().padStart(2, '0')}:00`,
              y: calculateMovingAverage(hour, allValues)
            })).filter(point => point.y !== null);

            // Find earliest and latest times across all days
            const allTimes = Object.values(groupedByDay)
              .flat()
              .map(v => v.exactTime)
              .sort();

            const firstTime = allTimes[0];
            const lastTime = allTimes[allTimes.length - 1];

            // Round down for start hour, round up for end hour
            const startHour = Math.max(0, Math.floor(parseInt(firstTime.split(':')[0])))- 1;
            const lastTimeHour = parseInt(lastTime.split(':')[0]);
            // Use exact last hour without padding
            const endHour = Math.min(23, lastTimeHour);

            // Format data for chart
            const chartData = {
              // Generate labels only for the visible time range
              labels: Array((endHour - startHour + 1) * 60).fill(0).map((_, i) => {
                const minutes = i + startHour * 60;
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
              }),
              datasets: Object.entries(groupedByDay).map(([day, values], index) => {
                const isSelectedDay = new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                }) === day;

                // Filter out any remaining non-positive values
                const validValues = values.filter(v => v.value > 0);

                return {
                  label: day,
                  data: validValues.map(v => ({
                    x: v.exactTime,
                    y: v.value
                  })),
                  borderColor: isSelectedDay ? APP_CONFIG.general.ui.theme.accent : '#666666',
                  borderWidth: isSelectedDay ? 2 : 1,
                  tension: 0.1,
                  fill: false,
                  showLine: true,
                  pointRadius: 2,
                  pointHoverRadius: 4
                };
              }),
              options: {
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      parser: 'HH:mm',
                      unit: 'hour',
                      stepSize: 1,
                      displayFormats: {
                        hour: 'HH:00'
                      }
                    },
                    grid: {
                      color: '#666666',
                      borderColor: '#666666'
                    },
                    ticks: {
                      color: '#efefef',
                      maxRotation: 0,
                      source: 'data',
                      autoSkip: false,
                      callback: function(value) {
                        return value.split(':')[0] + ':00';
                      }
                    },
                    min: `${startHour.toString().padStart(2, '0')}:00`,
                    max: `${endHour.toString().padStart(2, '0')}:00`
                  },
                  y: {
                    grid: {
                      color: '#666666',
                      borderColor: '#666666'
                    },
                    ticks: {
                      color: '#efefef'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#efefef',
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                }
              }
            };

            // Add moving average to datasets
            chartData.datasets.push({
              label: APP_CONFIG.components.charts.hourly.text.legend.movingAverage.replace('${range}', APP_CONFIG.components.charts.hourly.movingAverageHoursRange),
              data: movingAverages,
              borderColor: APP_CONFIG.general.ui.theme.chartMovingAverage,
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.3,
              fill: false,
              showLine: true,
              pointRadius: 1,
              pointHoverRadius: 3
            });

            // Update the chart
            onHourlyDataUpdate(chartData);
          } else {
            // No samples found - set empty data
            timestampsRef.current = [];
            onHourlyDataUpdate([]);
          }
        } catch (error) {
          console.error('Error getting hourly range:', error);
          timestampsRef.current = [];
          onHourlyDataUpdate([]);
        }
      } else {
        onHourlyDataUpdate([]);
      }
    } else {
      onHourlyDataUpdate([]);
    }
  };

  // Add new function to fetch monthly data
  const fetchMonthlyData = async (location, year, variable) => {
    const monthlyGroup = layersRef.current.monthlyGroup;
    
    if (monthlyGroup) {
      const activeLayer = monthlyGroup.layers.find(layer => 
        layer.title === `${variable} Monthly`
      );
      
      if (activeLayer) {
        try {
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31, 23, 59, 59);

          const response = await activeLayer.getSamples({
            geometry: {
              type: "point",
              longitude: location.longitude,
              latitude: location.latitude,
              spatialReference: { wkid: 4326 }
            },
            timeExtent: {
              start: startDate,
              end: endDate
            },
            returnFirstValueOnly: false
          });

          if (response?.samples) {
            const monthlyData = {};
            
            response.samples.forEach(sample => {
              const date = new Date(sample.attributes.StdTime);
              
              const month = date.getMonth();
              const rawValue = sample.attributes[variable === 'NO2' ? 'NO2_Troposphere' : 'HCHO'];
              const scientificValue = rawValue;
              
              // Convert the scientific notation to a readable value
              const convertedValue = variable === 'NO2' 
                ? Number(scientificValue) * 0.00000000000001 // Convert to ppb
                : Number(scientificValue) * 0.00000000000001 * 1000; // Convert to ppt
              
              if (!monthlyData[month]) {
                monthlyData[month] = [];
              }
              
              monthlyData[month].push(convertedValue);
            });
            
            // Calculate average for each month and prepare chart data
            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const chartData = {
              labels,
              datasets: [{
                data: Array(12).fill(null).map((_, i) => {
                  if (monthlyData[i] && monthlyData[i].length > 0) {
                    const sum = monthlyData[i].reduce((acc, val) => acc + val, 0);
                    return sum / monthlyData[i].length;
                  }
                  return null;
                }),
                borderColor: variable === 'NO2' ? APP_CONFIG.general.ui.theme.accent : '#63ABBB',
                backgroundColor: variable === 'NO2' ? APP_CONFIG.general.ui.theme.accent : '#63ABBB'
              }]
            };
            
            onMonthlyDataUpdate(chartData);
          }
        } catch (error) {
          console.error('Error getting monthly data:', error);
        }
      }
    }
  };

  // Update the fetchDailyData function with better error handling
  const fetchDailyData = async (location, year, variable) => {
    const dailyGroup = layersRef.current.dailyGroup;
    if (dailyGroup) {
      const activeLayer = dailyGroup.layers.find(layer => 
        layer.title === `${variable} Daily`
      );
      
      if (activeLayer) {
        try {
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31, 23, 59, 59);

          const response = await activeLayer.getSamples({
            geometry: {
              type: "point",
              longitude: location.longitude,
              latitude: location.latitude,
              spatialReference: { wkid: 4326 }
            },
            timeExtent: {
              start: startDate,
              end: endDate
            },
            returnFirstValueOnly: false
          });

          if (response?.samples) {
            const dailyData = response.samples.map(sample => ({
              date: new Date(sample.attributes.StdTime),
              value: sample.attributes[variable === 'NO2' ? 'NO2_Troposphere' : 'HCHO'] * 1e-12
            }));
            
            onDailyDataUpdate(dailyData);
          } else {
            onDailyDataUpdate([]);
          }
        } catch (error) {
          onDailyDataUpdate([]);
        }
      }
    }
  };

  // Main effect for map initialization - keep empty deps array
  useEffect(() => {
    if (viewRef.current) {
      return;
    }

    const container = mapDiv.current;
    
    if (!container) {
      return;
    }

    // Create the WebScene
    const webscene = new WebScene({
      portalItem: {
        id: APP_CONFIG.components.map.websceneId
      }
    });
    websceneRef.current = webscene;

    // Create the SceneView
    const view = new SceneView({
      container,
      map: webscene,
      environment: {
        atmosphere: {
          quality: 'high'
        }
      },
      ui: {
        components: []
      }
    });
    viewRef.current = view;
    
    // Wait for both view and webscene to load
    Promise.all([view.when(), webscene.load()]).then(async () => {
      // Log all layers in detail
      console.log('🔍 DETAILED LAYER STRUCTURE:', webscene.allLayers.map(layer => ({
        id: layer.id,
        title: layer.title,
        type: layer.type,
        visible: layer.visible,
        parent: layer.parent?.title,
        timeInfo: layer.timeInfo,
        timeExtent: layer.timeExtent,
        mosaicRule: layer.mosaicRule ? {
          multidimensionalDefinition: layer.mosaicRule.multidimensionalDefinition
        } : 'none'
      })));
      
      // Store references to layer groups
      layersRef.current.hourlyGroup = webscene.allLayers.find(layer => 
        layer.title === APP_CONFIG.components.map.layerGroupTitles.hourly
      );
      
      // More detailed logs of layer groups
      console.log('🔍 HOURLY GROUP STRUCTURE:', 
        layersRef.current.hourlyGroup ? {
          title: layersRef.current.hourlyGroup.title,
          visible: layersRef.current.hourlyGroup.visible,
          layers: layersRef.current.hourlyGroup.layers.map(l => ({
            title: l.title,
            visible: l.visible,
            timeInfo: l.timeInfo,
            timeExtent: l.timeExtent
          }))
        } : 'Not found'
      );
      
      // Initial layer visibility setup
      updateLayerVisibility(selectedVariable);

      // Keep monthly group hidden
      const monthlyGroup = webscene.allLayers.find(layer => 
        layer.title === APP_CONFIG.components.map.layerGroupTitles.monthly
      );
      if (monthlyGroup) {
        monthlyGroup.visible = false;
      }

      // Create controls container
      const controlsContainer = document.createElement('div');
      controlsContainer.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
        display: flex;
        flex-direction: column;
        gap: 5px;
      `;
      view.container.appendChild(controlsContainer);

      // Initialize widgets
      const initializeWidget = (Widget, options = {}) => {
        return new Promise((resolve) => {
          const widget = new Widget({ view, ...options });
          widget.when(() => resolve(widget));
        });
      };

      // Add Home Widget
      initializeWidget(Home).then(home => {
        home.container.style.cssText = `
          background-color: ${APP_CONFIG.general.ui.theme.backgroundPrimary} !important;
          color: ${APP_CONFIG.general.ui.theme.text} !important;
        `;
        controlsContainer.appendChild(home.container);
        
        // Add Compass after Home is loaded
        return initializeWidget(Compass);
      }).then(compass => {
        compass.container.style.cssText = `
          background-color: ${APP_CONFIG.general.ui.theme.backgroundPrimary} !important;
          color: ${APP_CONFIG.general.ui.theme.text} !important;
        `;
        controlsContainer.appendChild(compass.container);

        // Watch compass visibility
        view.watch('rotation', rotation => {
          compass.visible = (rotation !== 0);
        });
      }).catch(error => {
        console.warn('Error initializing widgets:', error);
      });

      // Add zoom controls
      const zoomButtons = document.createElement('div');
      zoomButtons.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 5px;
      `;

      ['zoom-in', 'zoom-out'].forEach((action, index) => {
        const button = document.createElement('button');
        button.className = 'esri-widget esri-widget--button';
        button.innerHTML = index === 0 ? '+' : '-';
        button.style.cssText = `
          width: 32px;
          height: 32px;
          background-color: ${APP_CONFIG.general.ui.theme.backgroundPrimary} !important;
          color: ${APP_CONFIG.general.ui.theme.text} !important;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
        `;
        button.onclick = () => view.zoom += index === 0 ? 1 : -1;
        zoomButtons.appendChild(button);
      });

      controlsContainer.appendChild(zoomButtons);

      // Add attribution
      const attribution = document.createElement('div');
      attribution.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 8px;
        background-color: ${APP_CONFIG.general.ui.theme.backgroundPrimary};
        color: ${APP_CONFIG.general.ui.theme.text};
        font-size: 12px;
        text-align: center;
        z-index: 99;
      `;
      attribution.innerHTML = `
        Esri, TomTom, FAO, NOAA, USGS | The products are generated by the Science Data Processing Center (SDPC)
      `;
      view.container.appendChild(attribution);

      // Loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'esri-widget';
      loadingIndicator.style.cssText = `
        position: absolute;
        bottom: 40px;
        right: 10px;
        padding: 4px 8px;
        background-color: ${APP_CONFIG.general.ui.theme.backgroundPrimary};
        color: ${APP_CONFIG.general.ui.theme.text};
        font-size: 12px;
        border-radius: 4px;
        display: none;
      `;
      loadingIndicator.innerHTML = 'Loading...';
      view.container.appendChild(loadingIndicator);

      // Watch view updates
      view.watch('updating', isUpdating => {
        attribution.style.opacity = isUpdating ? '0.5' : '1';
        loadingIndicator.style.display = isUpdating ? 'block' : 'none';
      });

      // Create and add legend
      const activeLayer = layersRef.current.hourlyGroup.layers.find(layer => 
        layer.title === `${selectedVariable} Hourly`
      );
      if (activeLayer) {
        try {
          const legendContainer = await createLegend(activeLayer);
          legendContainer.classList.add('legend-container');
          view.container.appendChild(legendContainer);
        } catch (error) {
          // Remove: console.error("Error creating legend:", error);
        }
      }

      onViewCreated?.(view);
    }).catch(error => {
      // Remove: console.error("Error loading scene:", error);
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
        onViewCreated?.(null);
      }
    };
  }, []); // Keep empty to run once

  // Add function to manage the location marker
  const updateLocationMarker = (location) => {
    if (!viewRef.current) return;

    // Remove existing graphic if it exists
    if (locationGraphicRef.current) {
      viewRef.current.graphics.remove(locationGraphicRef.current);
    }

    // Create new graphic
    const point = {
      type: "point",
      longitude: location.longitude,
      latitude: location.latitude
    };

    const markerSymbol = {
      type: "simple-marker",
      style: "circle",
      color: APP_CONFIG.general.ui.theme.accent,
      size: "8px",
      outline: {
        color: [255, 255, 255],
        width: 1
      }
    };

    const graphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    // Add graphic to the view
    viewRef.current.graphics.add(graphic);
    locationGraphicRef.current = graphic;
  };

  // Modify the click handler effect to use the new function
  useEffect(() => {
    if (!viewRef.current) return;
    
    const clickHandler = viewRef.current.on('click', async (event) => {
      const mapPoint = event.mapPoint;
      if (mapPoint) {
        const location = {
          latitude: mapPoint.latitude,
          longitude: mapPoint.longitude
        };
        
        updateLocationMarker(location);
        onLocationSelect(location);
        
        if (selectedDate) {
          fetchData(location, selectedDate, selectedVariable, selectedYear);
        }
      }
    });

    return () => {
      if (clickHandler) {
        clickHandler.remove();
      }
    };
  }, [selectedDate, selectedVariable, selectedYear, fetchData, onLocationSelect]);

  // Add effect to handle location updates from props
  useEffect(() => {
    if (selectedLocation) {
      updateLocationMarker(selectedLocation);
    }
  }, [selectedLocation]);

  // Modify the effect that handles variable changes to also update the time extent
  useEffect(() => {
    // First update layer visibility
    updateLayerVisibility(selectedVariable);
    
    // Then update the time extent for the newly active layer
    if (selectedDate) {
      updateLayerTimeExtent(selectedDate);
    }
    
    // Update legend when variable changes
    const hourlyGroup = layersRef.current.hourlyGroup;
    if (hourlyGroup && viewRef.current) {
      const activeLayer = hourlyGroup.layers.find(layer => 
        layer.title === `${selectedVariable} Hourly`
      );
      if (activeLayer) {
        // Remove old legend
        const oldLegend = viewRef.current.container.querySelector('.legend-container');
        if (oldLegend) {
          oldLegend.remove();
        }
        // Create new legend
        createLegend(activeLayer).then(legend => {
          legend.classList.add('legend-container');
          viewRef.current.container.appendChild(legend);
        });
      }
    }
  }, [selectedVariable, selectedDate]);

  // Function to update layer visibility
  const updateLayerVisibility = (variable) => {
    const hourlyGroup = layersRef.current.hourlyGroup;
    if (hourlyGroup) {
      hourlyGroup.visible = true;
      hourlyGroup.layers.forEach(layer => {
        layer.visible = layer.title === `${variable} Hourly`;
      });
    }
  };

  // Also ensure the layer initialization is working
  useEffect(() => {
    if (!websceneRef.current) {
      return;
    }

    const hourlyGroup = websceneRef.current.allLayers.find(layer => 
      layer.title === APP_CONFIG.components.map.layerGroupTitles.hourly
    );
    
    const monthlyGroup = websceneRef.current.allLayers.find(layer => 
      layer.title === APP_CONFIG.components.map.layerGroupTitles.monthly
    );
    
    const dailyGroup = websceneRef.current.allLayers.find(layer => 
      layer.title === APP_CONFIG.components.map.layerGroupTitles.daily
    );

    // Store references
    layersRef.current = {
      hourlyGroup,
      monthlyGroup,
      dailyGroup
    };

    // If layers loaded, try initial data fetch
    if (initialLocation && initialDate && hourlyGroup && dailyGroup) {
      fetchDailyData(initialLocation, selectedYear, selectedVariable);
    }
  }, [websceneRef.current]);

  // Improve updateLayerTimeExtent function with better error handling
  const updateLayerTimeExtent = (date) => {
    if (!viewRef.current) return;

    const hourlyGroup = layersRef.current.hourlyGroup;
    
    if (hourlyGroup) {
      hourlyGroup.visible = true;
      
      const activeLayer = hourlyGroup.layers.find(layer => 
        layer.title === `${selectedVariable} Hourly`
      );
      
      if (activeLayer) {
        activeLayer.visible = true;
        
        if (activeLayer.mosaicRule) {
          try {
            const targetTimestamp = date.valueOf();
            
            let closestTimestamp = targetTimestamp;
            if (timestampsRef.current.length > 0) {
              closestTimestamp = timestampsRef.current.reduce((prev, curr) => {
                return (Math.abs(curr - targetTimestamp) < Math.abs(prev - targetTimestamp) ? curr : prev);
              });
            }
            
            // Add a slight delay before updating mosaicRule to avoid race conditions
            setTimeout(() => {
              try {
                const mosaicRule = activeLayer.mosaicRule.clone();
                if (mosaicRule.multidimensionalDefinition && 
                    mosaicRule.multidimensionalDefinition.length > 0) {
                  mosaicRule.multidimensionalDefinition[0].values = [closestTimestamp];
                  activeLayer.mosaicRule = mosaicRule;
                }
              } catch (error) {
                // Silently handle any errors during mosaicRule update
                console.debug('Mosaic rule update error (non-critical):', error.message);
              }
            }, 50);
          } catch (error) {
            console.debug('Time extent update error (non-critical):', error.message);
          }
        }
      }
    }
  };

  // Add this function to the MapView component
  const centerMapOnLocation = (location) => {
    if (viewRef.current && location) {
      viewRef.current.goTo({
        center: [location.longitude, location.latitude],
        zoom: viewRef.current.zoom  // Maintain current zoom level
      }, {
        duration: 1000,  // Animate over 1 second
        easing: "ease-in-out"
      });
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    fetchLocationData: (location, date, variable) => {
      fetchLocationData(location, date, variable);
    },
    fetchHourlyRangeData: (location, date, variable) => {
      fetchHourlyRangeData(location, date, variable);
    },
    fetchMonthlyData: (location, year, variable) => {
      fetchMonthlyData(location, year, variable);
    },
    fetchDailyData: (location, year, variable) => {
      fetchDailyData(location, year, variable);
    },
    updateLayerTimeExtent,
    // Add the new method
    centerMapOnLocation
  }));

  return (
    <div ref={mapDiv} style={{ 
      width: '100%', 
      height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }} />
  );
});

export default MapView; 