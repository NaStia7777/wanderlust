import { IPoint } from "./places";

export interface GeocodedWaypoint {
   geocoder_status: string;
   place_id: string;
   types: string[];
}

export interface Location {
   lat: number;
   lng: number;
}

export interface Distance {
   text: string;
   value: number;
}

export interface Duration {
   text: string;
   value: number;
}

export interface Step {
   distance: Distance;
   duration: Duration;
   end_location: Location;
   html_instructions: string;
   polyline: { points: string };
   start_location: Location;
   travel_mode: string;
   maneuver?: string;
}

export interface Bounds {
   northeast: Location;
   southwest: Location;
}

export interface Route {
   bounds?: Bounds;
   copyrights?: string;
   legs?: {
      distance: Distance;
      duration: Duration;
      duration_in_traffic?: Duration;
      end_address: string;
      end_location: Location;
      start_address: string;
      start_location: Location;
      steps: Step[];
      traffic_speed_entry: any[];
      via_waypoint: any[];
   }[];
   overview_polyline: { points: string };
   summary?: string;
   warnings?: string[];
   waypoint_order?: any[];
}

export interface IDirectionsResponse {
   geocoded_waypoints?: GeocodedWaypoint[];
   error_message?: string;
   routes: Route[];
   status: string;
}
export interface IRequestGetDirections {
   origin: IPoint;
   destination: IPoint;
   mode: 'driving' | 'walking'; // | 'bicycling' | 'transit'
}