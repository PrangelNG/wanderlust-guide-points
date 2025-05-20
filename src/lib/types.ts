
export interface MapPoint {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  instructions?: string;
}

export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  instructions: string[];
}
