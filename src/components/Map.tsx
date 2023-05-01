import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

export const color = {
  "google-blue 100": `#4285F4`,
  "google-blue-dark 100": `#61a0bf`, // ADDED
  "google-blue-light 100": `#1bb6ff`, // ADDED
  "white 100": `rgb(255,255,255)`,
};

export type Coordinate = {
  lat: number;
  lng: number;
};

function Map({
  treasures,
  centerToMove,
  onCenterChanged,
}: {
  treasures?: Coordinate[];
  centerToMove?: Coordinate | null;
  onCenterChanged?: () => void;
}) {
  const [center, setCenter] = useState<Coordinate>();
  const [mapCenter, setMapCenter] = useState<Coordinate>();
  const [errorRange, setRrrorRange] = useState<number>();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY || "",
  });

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  function handleLoad(map: any) {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setRrrorRange(position.coords.accuracy);
    });
  }

  useEffect(() => {
    if (centerToMove) {
      setMapCenter(centerToMove);
    }
  }, [centerToMove]);

  return isLoaded ? (
    <GoogleMap
      onCenterChanged={() => {
        onCenterChanged?.();
        setMapCenter(undefined);
      }}
      id="google-map"
      mapContainerStyle={containerStyle}
      zoom={15}
      center={mapCenter}
      onLoad={handleLoad}
      options={options}
    >
      <div style={{ width: "200px", height: "200px", zIndex: 20000 }}>
        hithere
      </div>
      {center && (
        <>
          <Marker
            position={center}
            icon={{
              fillColor: color["google-blue 100"],
              fillOpacity: 1,
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              strokeColor: color["white 100"],
              strokeWeight: 2,
            }}
          />
          <Circle
            center={center}
            radius={errorRange}
            options={{
              fillColor: color["google-blue-dark 100"],
              fillOpacity: 0.4,
              strokeColor: color["google-blue-light 100"],
              strokeOpacity: 0.4,
              strokeWeight: 1,
              zIndex: 1,
            }}
          />
          {treasures &&
            treasures?.map((treasure) => {
              return (
                <Marker
                  position={treasure}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              );
            })}
        </>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default Map;
