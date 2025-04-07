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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = ({ data, selectedVariable, variableConfig }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          color: '#efefef',
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
        text: `Monthly ${selectedVariable} Values`,
        color: '#efefef',
        font: { size: 12 },
        padding: {
          top: 2,
          bottom: 4
        }
      },
      tooltip: {
        backgroundColor: '#1C243B',
        borderColor: '#C77A41',
        borderWidth: 1,
        titleFont: { size: 11 },
        bodyFont: { size: 11 }
      }
    },
    scales: {
      y: {
        grid: {
          color: '#666666'
        },
        ticks: {
          color: '#efefef',
          padding: 2,
          font: { size: 10 }
        },
        title: {
          display: true,
          text: variableConfig?.units || 'Value',
          color: '#efefef',
          font: { size: 10 },
          padding: { top: 0, bottom: 0 }
        }
      },
      x: {
        grid: {
          color: '#666666'
        },
        ticks: {
          color: '#efefef',
          padding: 2,
          font: { size: 10 }
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

export default MonthlyChart; 