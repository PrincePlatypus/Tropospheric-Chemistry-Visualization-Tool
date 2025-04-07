import { useState, useEffect } from 'react';
import WebScene from '@arcgis/core/WebScene';
import SceneView from '@arcgis/core/views/SceneView';

export function useMapView(containerRef, variableConfig) {
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const webscene = new WebScene({
      portalItem: {
        id: 'b6662d6616564a1284a5d7835137a493' // Your webscene ID
      }
    });

    const sceneView = new SceneView({
      container: containerRef.current,
      map: webscene,
      environment: {
        starsEnabled: false,
        atmosphereEnabled: false
      }
    });

    sceneView.when(() => {
      setView(sceneView);
      setLoading(false);
    });

    return () => {
      sceneView?.destroy();
    };
  }, [containerRef]);

  return { view, loading };
} 