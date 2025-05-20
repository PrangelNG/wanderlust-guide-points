
import React, { useState, useEffect, useRef } from 'react';
import { MapPoint, RouteInfo } from '@/lib/types';
import { getRouteInformation, formatCoordinates } from '@/lib/mapUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { MapPin, Navigation, Plus } from 'lucide-react';

interface MapProps {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  onSelectPoint: (point: MapPoint | null) => void;
  onAddPoint?: (lat: number, lng: number) => void;
  isAdmin: boolean;
}

const Map: React.FC<MapProps> = ({
  points,
  selectedPoint,
  onSelectPoint,
  onAddPoint,
  isAdmin
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapKey = "DEMO_MODE"; // In a real app, use an environment variable

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Create new markers for each point
      const newMarkers = points.map(point => {
        const marker = new google.maps.Marker({
          position: { lat: point.latitude, lng: point.longitude },
          map,
          title: point.name,
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: point.id === selectedPoint?.id ? '#10b981' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8,
          }
        });

        marker.addListener('click', () => {
          onSelectPoint(point);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, points, selectedPoint]);

  useEffect(() => {
    if (map && selectedPoint && userLocation) {
      // Get directions to selected point
      const directionsService = new google.maps.DirectionsService();
      
      if (!directionsRenderer) {
        const renderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3b82f6',
            strokeWeight: 5,
            strokeOpacity: 0.7
          }
        });
        setDirectionsRenderer(renderer);
      }

      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: selectedPoint.latitude, lng: selectedPoint.longitude },
          travelMode: google.maps.TravelMode.WALKING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && directionsRenderer) {
            directionsRenderer.setDirections(result);
            
            // Get detailed route information
            getRouteInformation(
              userLocation,
              { lat: selectedPoint.latitude, lng: selectedPoint.longitude }
            ).then(info => {
              setRouteInfo(info);
            });
          }
        }
      );
    } else if (directionsRenderer) {
      directionsRenderer.setMap(null);
      setRouteInfo(null);
    }
  }, [selectedPoint, userLocation, map, directionsRenderer]);

  const initMap = () => {
    if (mapRef.current) {
      const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 }, // Default: NYC
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        mapId: 'DEMO_MAP_ID',
      };

      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userPos);
            newMap.setCenter(userPos);
            
            // Add user location marker
            new google.maps.Marker({
              position: userPos,
              map: newMap,
              title: 'Your location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#3b82f6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
              }
            });
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

      // Add click listener for admin to add points
      if (isAdmin) {
        newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (onAddPoint && event.latLng) {
            onAddPoint(event.latLng.lat(), event.latLng.lng());
          }
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-md"
        style={{ minHeight: "500px" }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon"
          className="bg-white shadow-lg hover:bg-gray-100"
          onClick={() => {
            if (userLocation && map) {
              map.panTo(userLocation);
              map.setZoom(15);
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
        <div className="absolute bottom-4 left-4 max-w-md bg-white rounded-lg shadow-lg p-3">
          <h3 className="font-semibold text-sm">Route to {selectedPoint.name}</h3>
          <div className="text-xs text-gray-500 mt-1">
            <div>{routeInfo.distance} · {routeInfo.duration}</div>
            {userLocation && (
              <div className="mt-1">
                From: {formatCoordinates(userLocation.lat, userLocation.lng)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
