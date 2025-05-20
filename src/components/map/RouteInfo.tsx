
import React from 'react';
import { RouteInfo as RouteInfoType } from '@/lib/types';
import { formatCoordinates } from '@/lib/mapUtils';

interface RouteInfoProps {
  routeInfo: RouteInfoType;
  selectedPoint: {
    name: string;
  };
  userLocation: [number, number] | null;
}

const RouteInfoDisplay: React.FC<RouteInfoProps> = ({ routeInfo, selectedPoint, userLocation }) => {
  return (
    <div className="absolute bottom-4 left-4 max-w-md bg-white rounded-lg shadow-lg p-3 z-10">
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
  );
};

export default RouteInfoDisplay;
