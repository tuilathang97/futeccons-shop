"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FaqItem } from '../blocks/faq';
import { useFormContext } from 'react-hook-form';
import { Post } from './postSchema';
import { Input } from '../ui/input';
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
  iconSize: [24, 24],
  iconAnchor: [8, 16],
  popupAnchor: [0, -16],
  shadowUrl: markerShadow.src,
});

interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
}

const MapClickHandler = ({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Ho Chi Minh City coordinates
const LocationPicker: React.FC<LocationPickerProps> = ({ 
  initialLatitude = 10.823099,
  initialLongitude = 106.629664
}) => {
  const form = useFormContext<Post>();
  const [position, setPosition] = useState<[number, number]>([initialLatitude, initialLongitude]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const latitude = form.watch("latitude");
  const longitude = form.watch("longitude");
  const isSectionComplete = Boolean(latitude) && Boolean(longitude);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FaqItem
      question="Vị trí chính xác trên bản đồ"
      index={3}
      isFinish={isSectionComplete}
    >
      <div className="flex flex-col space-y-4">
        <p className="text-sm text-gray-500">
          Chọn vị trí chính xác của bất động sản trên bản đồ bằng cách nhấp vào vị trí tương ứng.
        </p>
        
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="number" step="any" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="number" step="any" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="h-[400px] w-full border border-gray-200 rounded-md overflow-hidden">
          {mapLoaded && (
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={true}
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
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handlePositionChange(pos.lat, pos.lng);
                  },
                }}
              />
              <MapClickHandler onPositionChange={handlePositionChange} />
            </MapContainer>
          )}
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <FormLabel>Vĩ độ</FormLabel>
            <Input 
              value={position[0]} 
              readOnly 
              className="bg-gray-50" 
            />
          </div>
          <div className="flex-1">
            <FormLabel>Kinh độ</FormLabel>
            <Input 
              value={position[1]} 
              readOnly 
              className="bg-gray-50" 
            />
          </div>
        </div>
      </div>
    </FaqItem>
  );
};

export default LocationPicker; 