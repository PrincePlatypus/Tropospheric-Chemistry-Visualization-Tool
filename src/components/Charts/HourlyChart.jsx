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

const HourlyChart = ({ data, selectedVariable, variableConfig }) => {
  // Extract theme colors from APP_CONFIG
  const { 
    backgroundPrimary, 
    accent, 
    text, 
    border 
  } = APP_CONFIG.general.ui.theme;
  
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
        text: APP_CONFIG.components.charts.hourly.text.title.replace('${variable}', selectedVariable),
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
          font: { size: 10 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12
        }
      }
    },
    layout: {
      padding: {
        top: 2,
        right: 2,
        bottom: 2,
        left: 2
      }
    }
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyChart; 