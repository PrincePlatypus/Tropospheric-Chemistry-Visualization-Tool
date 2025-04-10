import { useState, useEffect, useRef } from 'react';
import { CalciteShell } from '@esri/calcite-components-react';
import MapView from './components/Map/MapView';
import DailyChart from './components/Charts/DailyChart';
import MonthlyChart from './components/Charts/MonthlyChart';
import HourlyChart from './components/Charts/HourlyChart';
import { APP_CONFIG } from './config/appConfig';

function App() {
  // APP_CONFIG variables
  const defaultState = APP_CONFIG.general.defaultState;
  const yearSelectorRange = APP_CONFIG.general.yearSelectorRange;
  const uiTheme = APP_CONFIG.general.ui.theme;
  const uiText = APP_CONFIG.general.text;
  const chartsConfig = APP_CONFIG.components.charts;
  const yearSelectorIcons = APP_CONFIG.general.ui.icons.yearSelector;

  // Initial configuration from appConfig
  const INITIAL_DATE = defaultState.date;
  const INITIAL_LOCATION = {
    latitude: defaultState.view.center[1],
    longitude: defaultState.view.center[0]
  };
  const INITIAL_VARIABLE = defaultState.variable;
  const MOVING_AVERAGE_RANGE = chartsConfig.hourly.movingAverageHoursRange;

  // State with initial values
  const [selectedVariable, setSelectedVariable] = useState(INITIAL_VARIABLE);
  const [selectedLocation, setSelectedLocation] = useState(INITIAL_LOCATION);
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);
  const [selectedYear, setSelectedYear] = useState(INITIAL_DATE.getFullYear());
  const [pixelValue, setPixelValue] = useState(null);
  const [view, setView] = useState(null);
  const [hourlyChartData, setHourlyChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState(null);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [variableConfigApp, setVariableConfigApp] = useState(APP_CONFIG.variables[INITIAL_VARIABLE]);

  // Add ref for MapView component
  const mapViewRef = useRef(null);

  // Extract UI theme colors
  const {
    backgroundPrimary,
    backgroundSecondary,
    accent,
    border,
    text
  } = uiTheme;

  // Add useEffect to update variableConfigApp when selectedVariable changes
  useEffect(() => {
    setVariableConfigApp(APP_CONFIG.variables[selectedVariable]);
  }, [selectedVariable]);

  // Function to get the correct unit label - update to use variableConfigApp
  const getUnitLabel = () => {
    return variableConfigApp.units;
  };

  // Generate test data for each chart type
  const generateChartData = (type) => {
    const unitLabel = getUnitLabel();
    
    switch(type) {
      default:
        return null;
    }
  };

  // Define grid proportions as variables
  const leftColumnWidth = 45;
  const rightColumnWidth = 55;

  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  };

  const headerContainerStyle = {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleBarStyle = {
    height: '50px',
    backgroundColor: '#1C243B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    borderBottom: '1px solid #C77A41'
  };

  const controlItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#efefef',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  };

  const selectStyle = {
    backgroundColor: '#1C243B',
    color: '#efefef',
    border: '1px solid #666666',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    cursor: 'pointer'
  };

  // Create list of available years (from today back X years)
  const currentYear = new Date().getFullYear();
  // Use yearSelectorRange from appConfig instead of hardcoded 5
  const years = Array.from({ length: yearSelectorRange + 1 }, (_, i) => currentYear - i);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const handleVariableChange = (variable) => {
    setSelectedVariable(variable);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };


  const contentContainerStyle = {
    flex: '1 1 auto',
    display: 'grid',
    gridTemplateColumns: `${leftColumnWidth}fr ${rightColumnWidth}fr`,
    gap: '4px',
    padding: '4px',
    backgroundColor: '#1C243B',
    minHeight: 0,
    overflow: 'hidden'
  };

  const leftContainerStyle = {
    display: 'grid',
    gridTemplateRows: '10fr 90fr',
    gap: '4px',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#1C243B'
  };

  const rightContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '4px',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#1C243B',
    position: 'relative'
  };

  const controlsContainerStyle = {
    backgroundColor: '#1C243B',
    padding: '4px',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
    height: '100%',
    overflow: 'hidden'
  };

  const chartContainerStyle = {
    backgroundColor: '#1C243B',
    padding: '4px',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden'
  };

  const mapContainerStyle = {
    flex: 1,
    backgroundColor: '#1C243B',
    padding: '4px',
    borderRadius: '2px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Update the mapGhostContainerStyle to be more dynamic
  const mapGhostContainerStyle = {
    position: 'absolute',
    height: '100%',
    width: `${(100 * (leftColumnWidth + rightColumnWidth) / rightColumnWidth)}%`,
    left: '50%',
    transform: 'translateX(-50%)',
    overflow: 'hidden'
  };

  const titleStyle = {
    color: '#efefef',
    fontSize: '18px',
    fontWeight: '500',
    fontFamily: 'Poppins, sans-serif'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px'
  };

  const buttonStyle = (isActive) => ({
    padding: '6px 16px',
    backgroundColor: isActive ? '#C77A41' : 'transparent',
    border: '1px solid #C77A41',
    borderRadius: '4px',
    color: '#efefef',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px'
  });

  const howToButtonStyle = {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #666666',
    borderRadius: '4px',
    color: '#efefef',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const yearControlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: '#222C49',
    padding: '1px',
    borderRadius: '4px',
    height: '24px'
  };

  const yearButtonStyle = {
    backgroundColor: '#1C243B',
    color: '#efefef',
    border: 'none',
    borderRadius: '4px',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '10px',
    padding: '0',
    transition: 'background-color 0.2s ease'
  };

  const yearDisplayStyle = {
    backgroundColor: '#1C243B',
    color: '#efefef',
    padding: '1px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '500',
    minWidth: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    border: 'none'
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    }).replace(/\d+/, `${day}${getOrdinalSuffix(day)}`);
  };

  const handleDateSelect = (date) => {
    console.log('🔷 APP: Date selection handler called with', date.toISOString());
    setSelectedDate(date);

    if (selectedLocation && mapViewRef.current) {
      console.log('🔷 APP: Calling updateLayerTimeExtent for date', date.toISOString());
      mapViewRef.current.updateLayerTimeExtent(date);
      
      console.log('🔷 APP: Calling data fetch methods for location', selectedLocation);
      mapViewRef.current.fetchLocationData(selectedLocation, date, selectedVariable);
      mapViewRef.current.fetchHourlyRangeData(selectedLocation, date, selectedVariable);
      mapViewRef.current.fetchMonthlyData(selectedLocation, selectedYear, selectedVariable);
      mapViewRef.current.fetchDailyData(selectedLocation, selectedYear, selectedVariable);
    }
  };

  const handleHourlyDataUpdate = (data) => {
    setHourlyChartData(data);
  };

  const handleMonthlyDataUpdate = (data) => {
    setMonthlyChartData(data);
  };

  const handleDailyDataUpdate = (data) => {
    setDailyChartData(data);
  };

  // Initial data fetch effect - This might be running when it shouldn't
  useEffect(() => {
    if (selectedLocation && selectedDate) {
      const mapView = document.querySelector('MapView');
      if (mapView) {
        mapView.requestData(selectedLocation, selectedDate, selectedVariable);
      }
    }
  }, []); // Should this have dependencies?

  // Add this useEffect to refresh daily data when variable changes
  useEffect(() => {
    if (mapViewRef.current && selectedLocation) {
      console.log('🔄 Variable changed to:', selectedVariable, '- refreshing daily data');
      mapViewRef.current.fetchDailyData(
        selectedLocation, 
        selectedYear, 
        selectedVariable
      );
    }
  }, [selectedVariable, selectedYear, selectedLocation]);

  // Update labels to show initial state
  const locationDisplay = selectedLocation 
    ? `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`
    : 'No location selected';

  const dateDisplay = selectedDate
    ? formatDate(selectedDate)
    : 'No date selected';

  return (
    <CalciteShell style={{ width: '100vw', height: '100vh', backgroundColor: backgroundPrimary }}>
      <div style={mainContainerStyle}>
        {/* Header Container - Now only contains the title bar */}
        <div style={headerContainerStyle}>
          {/* Title Bar */}
          <div style={titleBarStyle}>
            <div style={titleStyle}>NO2 and HCHO</div>
            <div style={buttonGroupStyle}>
              {Object.keys(APP_CONFIG.variables).map(variable => (
                <button
                  key={variable}
                  style={buttonStyle(selectedVariable === variable)}
                  onClick={() => handleVariableChange(variable)}
                >
                  {APP_CONFIG.variables[variable].displayName}
                </button>
              ))}
            </div>
            <button style={howToButtonStyle}>How to</button>
          </div>
        </div>

        {/* Content Container */}
        <div style={contentContainerStyle}>
          {/* Left Side Container */}
          <div style={leftContainerStyle}>
            {/* Controls Container */}
            <div style={controlsContainerStyle}>
              {/* Date */}
              <div style={controlItemStyle}>
                <span>{uiText.labels.date}: {dateDisplay}</span>
              </div>

              {/* Location */}
              <div style={controlItemStyle}>
                <span>{uiText.labels.location}: {locationDisplay}</span>
              </div>

              {/* Year Selector */}
              <div style={yearControlStyle}>
                <button 
                  style={yearButtonStyle}
                  onClick={() => handleYearChange(-1)}
                  disabled={selectedYear <= Math.min(...years)}
                >
                  {yearSelectorIcons.first}
                </button>
                <button 
                  style={yearButtonStyle}
                  onClick={() => handleYearChange(-1)}
                  disabled={selectedYear <= Math.min(...years)}
                >
                  ◀
                </button>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={yearDisplayStyle}
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <button 
                  style={yearButtonStyle}
                  onClick={() => handleYearChange(1)}
                  disabled={selectedYear >= Math.max(...years)}
                >
                  ▶
                </button>
                <button 
                  style={yearButtonStyle}
                  onClick={() => handleYearChange(1)}
                  disabled={selectedYear >= Math.max(...years)}
                >
                  ⏭
                </button>
              </div>
              {/* Value */}
              <div style={controlItemStyle}>
                {pixelValue ? (
                  <span>{uiText.labels.value}: {pixelValue.toFixed(chartsConfig.common.valuePrecision)} {getUnitLabel()}</span>
                ) : (
                  <span>{uiText.status.loadingInitialData}</span>
                )}
              </div>
            </div>
                        {/* Hourly Chart */}
            <div style={chartContainerStyle}>
              <HourlyChart 
                data={hourlyChartData}
                selectedVariable={selectedVariable}
                variableConfig={variableConfigApp}
                selectedDate={selectedDate}
              />
            </div>

            {/* Daily Chart */}
            {/* <div style={chartContainerStyle}>
              <DailyChart 
                data={dailyChartData} 
                selectedVariable={selectedVariable}
                variableConfig={variableConfigApp}
                onDateSelect={handleDateSelect}
                selectedYear={selectedYear}
              />
            </div> */}

            {/* Monthly Chart */}
            {/* <div style={chartContainerStyle}>
              <MonthlyChart 
                data={monthlyChartData}
                selectedVariable={selectedVariable}
                variableConfig={variableConfigApp}
              />
            </div> */}
          </div>

          {/* Right Side Container */}
          <div style={rightContainerStyle}>
            {/* Map */}
            <div style={mapContainerStyle}>
                <div style={mapGhostContainerStyle}>
                    <MapView 
                        ref={mapViewRef}
                        onLocationSelect={setSelectedLocation}
                        selectedVariable={selectedVariable}
                        onViewCreated={setView}
                        onPixelValueChange={setPixelValue}
                        selectedDate={selectedDate}
                        selectedYear={selectedYear}
                        initialLocation={INITIAL_LOCATION}
                        initialDate={INITIAL_DATE}
                        onHourlyDataUpdate={handleHourlyDataUpdate}
                        onMonthlyDataUpdate={handleMonthlyDataUpdate}
                        onDailyDataUpdate={handleDailyDataUpdate}
                    />
                </div>
                {/* Pixel Value Popup */}
                {pixelValue && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(28, 36, 59, 0.9)',
                        padding: '8px',
                        borderRadius: '4px',
                        color: '#efefef',
                        border: '1px solid #C77A41',
                        zIndex: 2
                    }}>
                        {uiText.labels.value} {pixelValue.toFixed(chartsConfig.common.valuePrecision)} {variableConfigApp.units}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </CalciteShell>
  );
}

export default App;
