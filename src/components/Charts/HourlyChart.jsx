import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { APP_CONFIG } from '../../config/appConfig';
import { generateHourlyTestData } from '../../utils/testData';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HourlyChart = ({ data: realData, selectedVariable, variableConfig, selectedDate }) => {
  // Extract theme colors from APP_CONFIG
  const MOVING_AVERAGE_RANGE = APP_CONFIG.components.charts.hourly.movingAverageHoursRange;
  const borderColorAverage = APP_CONFIG.general.ui.theme.chartMovingAverage;  
  const fallbackYAxisTitle = APP_CONFIG.components.charts.common.fallbackYAxisTitle;
  const chartHourlyTextTitle = APP_CONFIG.components.charts.hourly.text.title.replace('${variable}', selectedVariable)



  const { 
    backgroundPrimary, 
    accent, 
    text, 
    border 
  } = APP_CONFIG.general.ui.theme;

  // Calculate moving average for hourly data
  const calculateMovingAverage = (hourlyData, hourIndex) => {
    
    const halfRange = Math.floor(MOVING_AVERAGE_RANGE / 2);
    let sum = 0;
    let count = 0;

    // For each day
    for (let dayData of hourlyData) {
      // Look at hours within the range
      for (let h = hourIndex - halfRange; h <= hourIndex + halfRange; h++) {
        // Handle wrapping around midnight
        const wrappedHour = ((h % 24) + 24) % 24;
        if (dayData[wrappedHour] !== null && !isNaN(dayData[wrappedHour])) {
          sum += dayData[wrappedHour];
          count++;
        }
      }
    }
    return count > 0 ? sum / count : null;
  };

  // Process test data into chart format
  const processTestData = (testData) => {
    const { dates, hourlyData, themeColors } = testData;
    const { accent, border } = themeColors;
    
    // Generate moving average data
    const movingAverageData = Array(24).fill(0)
      .map((_, hour) => calculateMovingAverage(hourlyData, hour));

    return {
      labels: Array(24).fill(0).map((_, i) => `${i.toString().padStart(2, '0')}:00`),
      datasets: [
        // Individual day datasets
        ...dates.map((date, index) => ({
          label: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          }),
          data: hourlyData[index],
          borderColor: index === 3 ? accent : border,
          borderWidth: index === 3 ? 2 : 1,
          tension: 0.1,
          fill: false
        })),
        // Moving average dataset
        {
          label: `${MOVING_AVERAGE_RANGE}hr Moving Average`,
          data: movingAverageData,
          borderColor: borderColorAverage,
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: false
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          color: text,
          padding: 4,
          boxWidth: 12,
          boxHeight: 12,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: chartHourlyTextTitle,
        color: text,
        font: { size: 12 },
        padding: {
          top: 2,
          bottom: 4
        }
      },
      tooltip: {
        backgroundColor: backgroundPrimary,
        borderColor: accent,
        borderWidth: 1,
        titleFont: { size: 11 },
        bodyFont: { size: 11 }
      }
    },
    scales: {
      y: {
        grid: {
          color: border
        },
        ticks: {
          color: text,
          padding: 2,
          font: { size: 10 }
        },
        title: {
          display: true,
          text: variableConfig?.units || fallbackYAxisTitle,
          color: text,
          font: { size: 10 },
          padding: { top: 0, bottom: 0 }
        }
      },
      x: {
        grid: {
          color: border
        },
        ticks: {
          color: text,
          padding: 2,
          font: { size: 10 }
        }
      }
    }
  };

  // Use real data if available, otherwise use test data if enabled
  let chartData;
  if (realData) {
    chartData = realData;
  } else {
    // Get test data
    const testData = generateHourlyTestData(selectedDate, { accent, border });
    
    if (testData) {
      // Process test data with our component's moving average calculation
      chartData = processTestData(testData);
    } else {
      // No test data and no real data - show empty chart
      chartData = {
        labels: Array(24).fill(0).map((_, i) => `${i}:00`),
        datasets: []
      };
    }
  }

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HourlyChart; 