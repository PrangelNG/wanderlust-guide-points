
import { MapPoint, RouteInfo } from './types';
import { sampleRouteInfo } from './dummyData';

// In a real application, this would call a directions API
export const getRouteInformation = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<RouteInfo> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve(sampleRouteInfo);
    }, 500);
  });
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Haversine formula to calculate distance between two points
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(2));
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

export const generateMapPointId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
