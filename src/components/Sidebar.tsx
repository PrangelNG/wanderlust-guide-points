
import React, { useState } from 'react';
import { MapPoint } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { calculateDistance } from '@/lib/mapUtils';
import { User, MapPin, Search } from 'lucide-react';

interface SidebarProps {
  points: MapPoint[];
  selectedPoint: MapPoint | null;
  onSelectPoint: (point: MapPoint) => void;
  userLocation: { lat: number; lng: number } | null;
  user: { name: string; isAdmin: boolean } | null;
  onUserChange: (isAdmin: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  points,
  selectedPoint,
  onSelectPoint,
  userLocation,
  user,
  onUserChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter points based on search term
  const filteredPoints = points.filter(point => 
    point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort points by distance if user location is available
  const sortedPoints = [...filteredPoints].sort((a, b) => {
    if (userLocation) {
      const distA = calculateDistance(
        userLocation.lat, userLocation.lng, 
        a.latitude, a.longitude
      );
      const distB = calculateDistance(
        userLocation.lat, userLocation.lng, 
        b.latitude, b.longitude
      );
      return distA - distB;
    }
    return 0;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Map Points</h2>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center"
              onClick={() => onUserChange(!user?.isAdmin)}
            >
              <User className="h-4 w-4 mr-2" />
              {user ? user.name : 'Guest'}
            </Button>
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search locations..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {user?.isAdmin && (
          <div className="mb-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-md text-xs">
              <strong>Admin Mode:</strong> Click on the map to add new points.
            </div>
          </div>
        )}
        
        <Separator className="my-2" />
      </div>
      
      <ScrollArea className="flex-1 px-4">
        {sortedPoints.length > 0 ? (
          <div className="space-y-2 pb-4">
            {sortedPoints.map((point) => (
              <div
                key={point.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedPoint?.id === point.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => onSelectPoint(point)}
              >
                <div className="flex items-start">
                  <MapPin className={`h-5 w-5 mr-2 shrink-0 ${
                    selectedPoint?.id === point.id ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{point.name}</div>
                    <div className="text-xs text-gray-500">{point.address}</div>
                    {userLocation && (
                      <div className="text-xs text-gray-400 mt-1">
                        {calculateDistance(
                          userLocation.lat, 
                          userLocation.lng, 
                          point.latitude, 
                          point.longitude
                        )} km away
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {searchTerm ? 'No matching locations found' : 'No locations available'}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
