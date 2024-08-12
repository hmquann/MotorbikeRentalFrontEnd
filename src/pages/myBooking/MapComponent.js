import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ';

const MapComponent = ({ startLocal, endLocal }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [startLocal[0], startLocal[1]], // Start location coordinates
      zoom: 12,
    });

    // Add navigation controls to the map
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add a marker at the end location
    new mapboxgl.Marker()
      .setLngLat([endLocal[0], endLocal[1]])
      .addTo(map.current);

    // Add a custom circular marker for the start location
    const startMarker = document.createElement('div');
    startMarker.style.width = '20px';
    startMarker.style.height = '20px';
    startMarker.style.backgroundColor = '#FF0000';
    startMarker.style.borderRadius = '50%';
    startMarker.style.border = '2px solid white';

    new mapboxgl.Marker(startMarker)
      .setLngLat([startLocal[0], startLocal[1]])
      .addTo(map.current);

    // Fetch and display the route
    const getRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLocal[0]},${startLocal[1]};${endLocal[0]},${endLocal[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const route = data.routes[0].geometry;

      // Add the route to the map
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route,
        },
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b9ddd',
          'line-width': 5,
        },
      });

      // Adjust the map bounds to fit the route
      const bounds = new mapboxgl.LngLatBounds();
      route.coordinates.forEach((coord) => bounds.extend(coord));
      map.current.fitBounds(bounds, {
        padding: 20,
      });
    };

    map.current.on('load', getRoute);

    return () => map.current.remove();
  }, [startLocal, endLocal]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent;
