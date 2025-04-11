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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = ({ data: realData, selectedVariable, variableConfig }) => {
  // Extract theme colors from APP_CONFIG
  const { 
    backgroundPrimary, 
    accent, 
    text, 
    border 
  } = APP_CONFIG.general.ui.theme;

  // Generate fallback data if no real data is provided
  const generateFallbackData = () => {
    return {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [{
        label: `Monthly ${selectedVariable} Values (${variableConfig.units})`,
        data: Array(12).fill(0).map(() => Math.random() * 10),
        borderColor: accent,
        tension: 0.1,
        fill: false
      }]
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
        text: APP_CONFIG.components.charts.monthly.text.title.replace('${variable}', selectedVariable),
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
          text: variableConfig?.units || APP_CONFIG.components.charts.common.fallbackYAxisTitle,
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

  // Use real data if available, otherwise use fallback data
  const chartData = realData || generateFallbackData();

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

export default MonthlyChart; 