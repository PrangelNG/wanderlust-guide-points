
import { MapPoint, User } from './types';

export const samplePoints: MapPoint[] = [
  {
    id: '1',
    name: 'Central Park',
    description: 'A large public park in Manhattan, New York City.',
    latitude: 40.7812,
    longitude: -73.9665,
    address: 'Central Park, New York, NY',
    instructions: 'Enter from the south entrance and follow the main path.'
  },
  {
    id: '2',
    name: 'Empire State Building',
    description: 'A 102-story skyscraper in Midtown Manhattan.',
    latitude: 40.7484,
    longitude: -73.9857,
    address: '350 5th Ave, New York, NY 10118',
    instructions: 'The main entrance is on 5th Avenue. Tickets can be purchased on the 2nd floor.'
  },
  {
    id: '3',
    name: 'Times Square',
    description: 'A major commercial intersection and tourist destination.',
    latitude: 40.7580,
    longitude: -73.9855,
    address: 'Times Square, New York, NY 10036',
    instructions: 'The red steps provide a great viewing spot for the billboards and activity.'
  },
  {
    id: '4', 
    name: 'Statue of Liberty',
    description: 'Iconic symbol of freedom and democracy.',
    latitude: 40.6892,
    longitude: -74.0445,
    address: 'Liberty Island, New York, NY 10004',
    instructions: 'Take the ferry from Battery Park. Advanced reservations recommended.'
  },
  {
    id: '5',
    name: 'Brooklyn Bridge',
    description: 'A historic bridge connecting Manhattan and Brooklyn.',
    latitude: 40.7061,
    longitude: -73.9969,
    address: 'Brooklyn Bridge, New York, NY 10038',
    instructions: 'Pedestrian access is available from both Manhattan and Brooklyn sides.'
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'Regular User',
    isAdmin: false
  },
  {
    id: '2',
    name: 'Admin User',
    isAdmin: true
  }
];

export const sampleRouteInfo = {
  distance: '2.5 miles',
  duration: '35 minutes',
  instructions: [
    'Head north on 5th Ave toward W 34th St',
    'Turn right onto W 42nd St',
    'Continue for 0.5 miles',
    'Turn left onto Broadway',
    'Your destination will be on the right'
  ]
};
