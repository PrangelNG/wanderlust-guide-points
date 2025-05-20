
import React, { useState, useEffect, useRef } from 'react';
import { MapPoint, RouteInfo } from '@/lib/types';
import { getRouteInformation, formatCoordinates } from '@/lib/mapUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { MapPin, Navigation, Plus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  onSelectPoint: (point: MapPoint | null) => void;
  onAddPoint?: (lat: number, lng: number) => void;
  isAdmin: boolean;
}

// Fix for default Leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to handle map interactions
const MapInteractions = ({ onAddPoint, isAdmin }: { onAddPoint?: (lat: number, lng: number) => void, isAdmin: boolean }) => {
  useMapEvents({
    click: (e) => {
      if (isAdmin && onAddPoint) {
        onAddPoint(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

// Component to handle center changes
const ChangeMapView = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
  
  return null;
};

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
          toast({
            title: "Location Access Denied",
            description: "Please enable location services to use navigation features.",
            variant: "destructive",
          });
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
        // In a real app, you would use a routing API to get the actual route path
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

  // Function to create custom marker icons
  const createMarkerIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-4 h-4 rounded-full ${isSelected ? 'bg-green-500' : 'bg-red-500'} border-2 border-white"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  // Function to create user location marker
  const userMarkerIcon = L.divIcon({
    className: 'user-marker',
    html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow-md"
        whenCreated={(map) => { mapRef.current = map; }}
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
          <L.Polyline 
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
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button 
          variant="secondary" 
          size="icon"
          className="bg-white shadow-lg hover:bg-gray-100"
          onClick={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.setView(userLocation, 15);
            } else {
              toast({
                title: "Location not available",
                description: "Please enable location services to use this feature.",
              });
            }
          }}
        >
          <Navigation className="h-5 w-5 text-gray-700" />
        </Button>
        
        {isAdmin && (
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white shadow-lg hover:bg-gray-100"
            onClick={() => {
              toast({
                title: "Add Point Mode",
                description: "Click anywhere on the map to add a new point.",
              });
            }}
          >
            <Plus className="h-5 w-5 text-gray-700" />
          </Button>
        )}
      </div>
      
      {/* Route Information */}
      {routeInfo && selectedPoint && (
        <div className="absolute bottom-4 left-4 max-w-md bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <h3 className="font-semibold text-sm">Route to {selectedPoint.name}</h3>
          <div className="text-xs text-gray-500 mt-1">
            <div>{routeInfo.distance} · {routeInfo.duration}</div>
            {userLocation && (
              <div className="mt-1">
                From: {formatCoordinates(userLocation[0], userLocation[1])}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
