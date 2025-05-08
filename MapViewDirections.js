<MapViewDirections
  origin={{
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  }}
  destination={{
    latitude: destination.latitude,
    longitude: destination.longitude
  }}
  apikey={GOOGLE_MAPS_API_KEY}
  strokeWidth={4}
  strokeColor="blue"
  mode="DRIVING"
  optimizeWaypoints={true}
  onReady={result => {
    mapRef.current?.fitToCoordinates(result.coordinates, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
    });
  }}
/>
