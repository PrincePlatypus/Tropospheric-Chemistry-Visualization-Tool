import React, { createContext, useState, useContext } from 'react';
import { APP_CONFIG } from '../config/appConfig';

// Create the context with initial values from APP_CONFIG
const DateContext = createContext({
  date: APP_CONFIG.general.defaultState.date,
  setDate: () => {}
});

// Create a provider component
export const DateProvider = ({ children }) => {
  const [date, setDate] = useState(APP_CONFIG.general.defaultState.date);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

// Custom hook to use the date context
export const useDate = () => useContext(DateContext); 