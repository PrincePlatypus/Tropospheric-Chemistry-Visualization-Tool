import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { APP_CONFIG } from '../../config/appConfig';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const { backgroundPrimary, backgroundSecondary, accent, text, border } = APP_CONFIG.general.ui.theme;
  const [isOpen, setIsOpen] = useState(false);

  // Format date for display using 24-hour format
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      hour12: false, // Use 24-hour format
      minute: '2-digit'
    });
  };

  // Custom styles to match your app's theme
  const customStyles = `
    .react-datepicker {
      background-color: ${backgroundSecondary};
      border: 1px solid ${border};
      border-radius: 4px;
      font-family: inherit;
      font-size: 12px;
    }
    .react-datepicker__header {
      background-color: ${backgroundPrimary};
      border-bottom: 1px solid ${border};
    }
    .react-datepicker__current-month, 
    .react-datepicker__day-name, 
    .react-datepicker-time__header {
      color: ${text};
    }
    .react-datepicker__day {
      color: ${text};
    }
    .react-datepicker__day:hover {
      background-color: ${accent};
      color: white;
    }
    .react-datepicker__day--selected {
      background-color: ${accent};
      color: white;
    }
    .react-datepicker__day--keyboard-selected {
      background-color: ${accent};
      color: white;
    }
    .react-datepicker__navigation {
      top: 8px;
    }
    .react-datepicker__input-container input {
      background-color: ${backgroundPrimary};
      border: 1px solid ${border};
      border-radius: 4px;
      color: ${text};
      font-size: 14px;
      padding: 4px 8px;
      width: 150px;
      text-align: center;
    }
    .react-datepicker__time-container {
      border-left: 1px solid ${border};
    }
    .react-datepicker__time-container .react-datepicker__time {
      background-color: ${backgroundSecondary};
    }
    .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
      color: ${text};
    }
    .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
      background-color: ${accent};
      color: white;
    }
    .react-datepicker__time-container .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
      background-color: ${accent};
      color: white;
    }
    .react-datepicker__month-dropdown, 
    .react-datepicker__year-dropdown {
      background-color: ${backgroundSecondary};
      border: 1px solid ${border};
    }
    .react-datepicker__month-option, 
    .react-datepicker__year-option {
      color: ${text};
    }
    .react-datepicker__month-option:hover, 
    .react-datepicker__year-option:hover {
      background-color: ${accent};
      color: white;
    }
    /* Clock picker styles */
    .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
      width: 85px;
      overflow-x: hidden;
      margin: 0 auto;
      text-align: center;
      border-bottom-right-radius: 0.3rem;
    }
    .react-datepicker__time-list-item {
      height: 30px !important;
      padding: 5px 10px !important;
    }
  `;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  };

  return (
    <div style={containerStyle}>
      <style>{customStyles}</style>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="MMM d, yyyy HH:mm" // Use HH for 24-hour format
        showTimeSelect
        timeFormat="HH:mm"            // Use HH for 24-hour format
        timeIntervals={15}
        timeCaption="Time"
        showMonthDropdown
        showYearDropdown={false}
        dropdownMode="select"
        todayButton="Today"
        maxDate={new Date()}
        onInputClick={() => setIsOpen(!isOpen)}
        onClickOutside={() => setIsOpen(false)}
      />
    </div>
  );
};

export default DateSelector; 