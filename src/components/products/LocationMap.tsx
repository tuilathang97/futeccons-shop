"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, string>)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const houseIcon = new Icon({
  iconUrl: '/house-marker.png',
  iconSize: [16, 16],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16],
  shadowUrl: markerShadow.src,
});

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  popupText?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  popupText = "Vị trí bất động sản"
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const position: [number, number] = [
    latitude ?? 10.823099, 
    longitude ?? 106.629664
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!latitude || !longitude) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 border rounded-md text-gray-500">
        Không có thông tin vị trí
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full border border-gray-200 rounded-md overflow-hidden">
      {mapLoaded && (
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            tileSize={256}
            zoomOffset={0}
            subdomains="abcd"
          />
          <Marker 
            position={position} 
            icon={houseIcon}
          >
            <Popup>
              {popupText}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LocationMap; 