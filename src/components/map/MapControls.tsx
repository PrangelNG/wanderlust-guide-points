
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Map as LeafletMap } from 'leaflet';

interface MapControlsProps {
  userLocation: [number, number] | null;
  isAdmin: boolean;
  mapRef: React.MutableRefObject<LeafletMap | null>;
}

const MapControls: React.FC<MapControlsProps> = ({ userLocation, isAdmin, mapRef }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
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
  );
};

export default MapControls;
