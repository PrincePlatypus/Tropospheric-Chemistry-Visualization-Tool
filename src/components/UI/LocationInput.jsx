import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../../config/appConfig';

const LocationInput = ({ selectedLocation, onLocationChange }) => {
  const { backgroundPrimary, border, text } = APP_CONFIG.general.ui.theme;
  const [lat, setLat] = useState(selectedLocation?.latitude || '');
  const [lon, setLon] = useState(selectedLocation?.longitude || '');

  // Update local state when selectedLocation changes (e.g., from map clicks)
  useEffect(() => {
    if (selectedLocation) {
      setLat(selectedLocation.latitude.toFixed(6));
      setLon(selectedLocation.longitude.toFixed(6));
    }
  }, [selectedLocation]);

  const inputStyle = {
    backgroundColor: 'white',
    border: `1px solid ${border}`,
    borderRadius: '4px',
    color: '#333',
    padding: '4px 8px',
    width: '120px',
    fontSize: '12px',
    textAlign: 'center',
    marginLeft: '4px'
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Check if the pasted text matches the format "lat,lon" or "lat, lon"
    const coordinates = pastedText.split(',').map(coord => coord.trim());
    
    if (coordinates.length === 2) {
      const [newLat, newLon] = coordinates;
      if (!isNaN(newLat) && !isNaN(newLon)) {
        setLat(parseFloat(newLat).toFixed(6));
        setLon(parseFloat(newLon).toFixed(6));
        onLocationChange({
          latitude: parseFloat(newLat),
          longitude: parseFloat(newLon)
        });
      }
    }
  };

  const handleInputChange = (value, type) => {
    // Remove any non-numeric characters except decimal point and minus sign
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    if (type === 'lat') {
      setLat(cleanValue);
    } else {
      setLon(cleanValue);
    }
  };

  const handleSubmit = () => {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    
    if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
      console.log('Submitting location:', { latitude: parsedLat, longitude: parsedLon });
      onLocationChange({
        latitude: parsedLat,
        longitude: parsedLon
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      e.target.blur(); // Remove focus
      handleSubmit();
    }
  };

  return (
    <div style={containerStyle}>
      <div>
        <span style={{ color: text, fontSize: '12px' }}>Lat:</span>
        <input
          type="text"
          value={lat}
          onChange={(e) => handleInputChange(e.target.value, 'lat')}
          onBlur={handleSubmit}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          style={inputStyle}
          placeholder="Latitude"
        />
      </div>
      <div>
        <span style={{ color: text, fontSize: '12px' }}>Lon:</span>
        <input
          type="text"
          value={lon}
          onChange={(e) => handleInputChange(e.target.value, 'lon')}
          onBlur={handleSubmit}
          onKeyDown={handleKeyPress}
          onPaste={handlePaste}
          style={inputStyle}
          placeholder="Longitude"
        />
      </div>
    </div>
  );
};

export default LocationInput; 