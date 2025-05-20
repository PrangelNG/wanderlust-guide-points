
import React, { useState, useEffect, useRef } from 'react';
import { MapPoint, RouteInfo } from '@/lib/types';
import { getRouteInformation } from '@/lib/mapUtils';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import our new components
import MapInteractions from './map/MapInteractions';
import ChangeMapView from './map/ChangeMapView';
import RouteInfoDisplay from './map/RouteInfo';
import MapControls from './map/MapControls';
import { createMarkerIcon, userMarkerIcon, initializeDefaultIcon } from './map/MarkerIcons';

interface MapProps {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  onSelectPoint: (point: MapPoint | null) => void;
  onAddPoint?: (lat: number, lng: number) => void;
  isAdmin: boolean;
}

// Initialize default Leaflet icon
initializeDefaultIcon();

const Map: React.FC<MapProps> = ({
  points,
  selectedPoint,
  onSelectPoint,
  onAddPoint,
  isAdmin
}) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default: NYC
  const [polyline, setPolyline] = useState<[number, number][]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        () => {
          // Handle location error
          // This is now handled in MapControls component
        }
      );
    }
  }, []);

  // Update route when selected point changes
  useEffect(() => {
    if (selectedPoint && userLocation) {
      // Get route information
      getRouteInformation(
        { lat: userLocation[0], lng: userLocation[1] },
        { lat: selectedPoint.latitude, lng: selectedPoint.longitude }
      ).then(info => {
        setRouteInfo(info);
        
        // Create a simple straight line for the route
        setPolyline([
          userLocation,
          [selectedPoint.latitude, selectedPoint.longitude]
        ]);
      });
    } else {
      setRouteInfo(null);
      setPolyline([]);
    }
  }, [selectedPoint, userLocation]);

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow-md z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation} icon={userMarkerIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={[point.latitude, point.longitude]}
            icon={createMarkerIcon(point.id === selectedPoint?.id)}
            eventHandlers={{
              click: () => {
                onSelectPoint(point);
              }
            }}
          >
            <Popup>
              <div className="font-medium">{point.name}</div>
              <div className="text-xs text-gray-500">{point.address}</div>
            </Popup>
          </Marker>
        ))}
        
        {polyline.length > 0 && (
          <Polyline 
            positions={polyline}
            color="#3b82f6"
            weight={5}
            opacity={0.7}
          />
        )}
        
        <MapInteractions onAddPoint={onAddPoint} isAdmin={isAdmin} />
        {userLocation && <ChangeMapView coords={userLocation} />}
      </MapContainer>
      
      {/* Map Controls */}
      <MapControls 
        userLocation={userLocation} 
        isAdmin={isAdmin} 
        mapRef={mapRef} 
      />
      
      {/* Route Information */}
      {routeInfo && selectedPoint && (
        <RouteInfoDisplay 
          routeInfo={routeInfo} 
          selectedPoint={selectedPoint} 
          userLocation={userLocation} 
        />
      )}
    </div>
  );
};

export default Map;
