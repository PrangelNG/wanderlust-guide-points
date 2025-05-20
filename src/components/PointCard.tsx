
import React from 'react';
import { MapPoint, RouteInfo } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

interface PointCardProps {
  point: MapPoint;
  routeInfo: RouteInfo | null;
  onGetDirections: () => void;
  onClose: () => void;
}

const PointCard: React.FC<PointCardProps> = ({ point, routeInfo, onGetDirections, onClose }) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{point.name}</CardTitle>
            <CardDescription className="text-sm">{point.address}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-gray-700 mb-3">{point.description}</p>
        
        {point.instructions && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Access Instructions:</h4>
            <p className="text-xs text-gray-600">{point.instructions}</p>
          </div>
        )}
        
        {routeInfo && (
          <div className="mt-4">
            <div className="flex items-center text-sm font-medium mb-2">
              <Navigation className="h-4 w-4 mr-1 text-map-route" />
              <span>{routeInfo.distance} · {routeInfo.duration}</span>
            </div>
            
            <div className="space-y-2">
              {routeInfo.instructions.map((instruction, i) => (
                <div key={i} className="flex items-start text-xs">
                  <div className="bg-gray-200 text-gray-700 rounded-full h-5 w-5 flex items-center justify-center mr-2 shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={onGetDirections}>
          <Navigation className="h-4 w-4 mr-2" />
          Get Directions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PointCard;
