import { useEffect, useRef } from 'react';

const DailyChart = ({ data, selectedVariable, variableConfig, onDateSelect, selectedYear }) => {
  const PADDING_RIGHT = 20;
  const DAY_LABEL_WIDTH = 20;

  const gridContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: `calc(100% - ${PADDING_RIGHT}px)`,
    height: '100%',
    color: '#efefef',
    gap: '2px',
    padding: '4px',
    marginRight: `${PADDING_RIGHT}px`

  };

  const headerStyle = {
    fontSize: '16px',
    padding: '2px',
    textAlign: 'center',
    fontWeight: '500'
  };

  const gridStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gap: '2px',
    overflow: 'hidden',
    minHeight: 0
  };

  const weekLabelsStyle = {
    display: 'grid',
    gridTemplateColumns: `${DAY_LABEL_WIDTH}px repeat(53, 1fr)`,
    gap: '1px',
    fontSize: '10px',
    minHeight: '16px'
  };

  const weekLabelStyle = {
    textAlign: 'center',
    color: '#efefef',
    padding: '1px',
    overflow: 'hidden'
  };

  const mainGridStyle = {
    display: 'grid',
    gridTemplateColumns: `${DAY_LABEL_WIDTH}px repeat(53, 1fr)`,
    gap: '1px',
    overflow: 'hidden',
    minHeight: 0
  };

  const dayLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    fontSize: '10px',
    color: '#efefef',
    width: `${DAY_LABEL_WIDTH}px`,
    boxSizing: 'border-box'
  };

  const cellStyle = (value) => ({
    backgroundColor: getCellColor(value),
    width: '100%',
    height: '100%',
    borderRadius: '1px'
  });

  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Define color scale constants
  const COLOR_START = [189, 175, 129, 255]; // light beige
  const COLOR_END = [37, 11, 47, 255]; // dark purple
  const VALUE_MAX = 300; // maximum value for scaling

  // Non-linear color mapping function
  const getCellColor = (value) => {
    if (value === null || value === undefined) return '#222C49'; // default background for no data
    
    // Clamp value between 0 and VALUE_MAX
    const clampedValue = Math.max(0, Math.min(value, VALUE_MAX));
    
    // Apply non-linear transformation (square root) to emphasize differences at higher values
    // This creates a one-tailed distribution effect
    const normalizedValue = Math.sqrt(clampedValue / VALUE_MAX);
    
    // Interpolate between start and end colors
    const r = Math.round(COLOR_START[0] + normalizedValue * (COLOR_END[0] - COLOR_START[0]));
    const g = Math.round(COLOR_START[1] + normalizedValue * (COLOR_END[1] - COLOR_START[1]));
    const b = Math.round(COLOR_START[2] + normalizedValue * (COLOR_END[2] - COLOR_START[2]));
    const a = (COLOR_START[3] + normalizedValue * (COLOR_END[3] - COLOR_START[3])) / 255;
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Function to determine if week number should be shown
  const shouldShowWeek = (week) => {
    // Show week numbers at regular intervals
    return week % 5 === 0;
  };

  // Create a map of dates to values with proper type checking
  const dateValueMap = new Map();
  if (data && Array.isArray(data)) {
    data.forEach(item => {
      if (item && item.date instanceof Date && typeof item.value === 'number') {
        const dateStr = item.date.toISOString().split('T')[0];
        dateValueMap.set(dateStr, item.value);
      }
    });
  }

  // Function to get the first day of the year
  const getFirstDayOfYear = (year) => {
    return new Date(year, 0, 1).getDay();
  };

  // Function to get the number of days in the year
  const getDaysInYear = (year) => {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365;
  };

  // Calculate week offset based on first day of year
  const firstDayOffset = getFirstDayOfYear(selectedYear);
  // Convert Sunday (0) to 6 for our Monday-based week
  const weekOffset = firstDayOffset === 0 ? 6 : firstDayOffset - 1;

  // Function to get value for a specific date
  const getValueForDate = (week, dayIndex) => {
    const date = new Date(selectedYear, 0, 1);
    const dayNumber = week * 7 + dayIndex - weekOffset;
    date.setDate(date.getDate() + dayNumber);

    // Only return values for the selected year
    if (date.getFullYear() !== selectedYear) {
      return null;
    }

    const dateStr = date.toISOString().split('T')[0];
    return dateValueMap.get(dateStr);
  };

  // Function to get date string for tooltip
  const getDateString = (week, dayIndex) => {
    const date = new Date(selectedYear, 0, 1);
    const dayNumber = week * 7 + dayIndex - weekOffset;
    date.setDate(date.getDate() + dayNumber);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  // Update cell click handler to properly pass the date
  const handleCellClick = (week, dayIndex) => {
    const date = new Date(selectedYear, 0, 1);
    const dayNumber = week * 7 + dayIndex - weekOffset;
    date.setDate(date.getDate() + dayNumber);
    
    if (date.getFullYear() === selectedYear) {
      console.log('🔶 DAILY CHART: Box clicked for date', date.toISOString());
      onDateSelect(date);
    }
  };

  // Calculate number of weeks needed
  const totalDays = getDaysInYear(selectedYear);
  const totalWeeks = Math.ceil((totalDays + weekOffset) / 7);

  return (
    <div style={gridContainerStyle}>
      <div style={headerStyle}>
        Daily {selectedVariable} Values
      </div>
      <div style={gridStyle}>
        {/* Week labels */}
        <div style={weekLabelsStyle}>
          <div style={weekLabelStyle}></div>
          {Array(53).fill(0).map((_, week) => (
            <div key={week} style={weekLabelStyle}>
              {shouldShowWeek(week) ? week + 1 : ''}
            </div>
          ))}
        </div>

        {/* Main grid with day labels and cells */}
        <div style={mainGridStyle}>
          {/* Day labels column */}
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)' }}>
            {days.map(day => (
              <div key={day} style={dayLabelStyle}>
                {day}
              </div>
            ))}
          </div>

          {/* Data cells */}
          {Array(53).fill(0).map((_, week) => (
            <div key={week} style={{ 
              display: 'grid', 
              gridTemplateRows: 'repeat(7, 1fr)', 
              gap: '1px',
              minHeight: 0
            }}>
              {days.map((_, dayIndex) => {
                const value = getValueForDate(week, dayIndex);
                const dateStr = getDateString(week, dayIndex);
                const isValidDate = value !== null;

                return (
                  <div
                    key={`${week}-${dayIndex}`}
                    style={{
                      ...cellStyle(value),
                      cursor: isValidDate ? 'pointer' : 'default',
                      opacity: isValidDate ? 1 : 0.3
                    }}
                    onClick={() => isValidDate && handleCellClick(week, dayIndex)}
                    title={isValidDate ? 
                      `${dateStr}: ${value?.toFixed(2)} ${variableConfig?.units || ''}` : 
                      'No data available'
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyChart; 