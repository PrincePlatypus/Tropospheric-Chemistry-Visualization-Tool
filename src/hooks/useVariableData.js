import { useState, useEffect } from 'react';
import { VARIABLES } from '../config/variables';

export function useVariableData(view, location, selectedVariable, timeRange) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!view || !location) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const layer = view.map.layers.find(layer => 
          layer.title === VARIABLES[selectedVariable].groupLayer
        );
        
        if (!layer) {
          throw new Error(`Layer ${VARIABLES[selectedVariable].groupLayer} not found`);
        }

        const samples = await layer.getSamples({
          geometry: location,
          timeExtent: timeRange,
          returnFirstValueOnly: false
        });

        // Process the data according to the variable configuration
        const processedData = samples.map(sample => ({
          timestamp: sample.attributes.StdTime,
          value: VARIABLES[selectedVariable].postProcess(
            sample.attributes[VARIABLES[selectedVariable].name]
          )
        }));

        setData(processedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [view, location, selectedVariable, timeRange]);

  return { data, loading, error };
} 