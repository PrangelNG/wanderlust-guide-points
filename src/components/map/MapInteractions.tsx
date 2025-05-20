
import React from 'react';
import { useMapEvents } from 'react-leaflet';

interface MapInteractionsProps {
  onAddPoint?: (lat: number, lng: number) => void;
  isAdmin: boolean;
}

const MapInteractions: React.FC<MapInteractionsProps> = ({ onAddPoint, isAdmin }) => {
  useMapEvents({
    click: (e) => {
      if (isAdmin && onAddPoint) {
        onAddPoint(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

export default MapInteractions;
