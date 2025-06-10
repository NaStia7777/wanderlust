import { ChangeEvent, KeyboardEvent } from 'react';
import { MapPin, Calendar, Locate, SquarePen } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { IPoint } from '../../models/places';
import { useAppDispatch } from '../../hooks/useApp';
import { addressAPI } from '../../store/api/adress';

export interface ITripData {
  startPoint: string,
  name: string,
  startDate: string,
  backtrack: boolean,
  coordinates?: IPoint,
}

interface TripHeaderProps {
  tripData: ITripData,
  onTripDataChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBacktrackChange: (checked: boolean) => void;
  onLocationUpdate: (location: string, coordinates: { lat: number; lon: number }) => void;
}

export function TripHeader({
  tripData,
  onTripDataChange,
  onBacktrackChange,
  onLocationUpdate
}: TripHeaderProps) {
  const { getCurrentLocation, isLoading, error } = useGeolocation();

  const handleGetCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onLocationUpdate(location.address, { lat: location.coordinates.latitude, lon: location.coordinates.longitude });
    }
  };
  const dispatch = useAppDispatch();

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tripData.startPoint != '') {
      const result = await dispatch(addressAPI.endpoints.fetchCoordinates.initiate(tripData.startPoint));
      if ('data' in result) {
        let adresses = result.data;
        if (adresses && adresses.length > 0) {
          onLocationUpdate(adresses[0].display_name, { lat: parseFloat(adresses[0].lat), lon: parseFloat(adresses[0].lon) });
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Starting Point
            </div>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter address..."
              name="startPoint"
              value={tripData.startPoint}
              onChange={onTripDataChange}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center gap-2"
            >
              <Locate className="w-4 h-4" />
              {isLoading ? 'Loading...' : 'Current'}
            </button>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          {!error && !tripData.coordinates && (
            <p className="mt-1 text-sm text-red-600">Enter the starting address</p>
          )}
          <div className="mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={tripData.backtrack}
                onChange={(e) => onBacktrackChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Return to starting point</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <SquarePen className="w-4 h-4 mr-1" />
              Name
            </div>
          </label>
          <input
            type="text"
            name="name"
            placeholder='Enter name...'
            value={tripData.name}
            onChange={onTripDataChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Start Date
            </div>
          </label>
          <input
            type="date"
            name="startDate"
            value={tripData.startDate}
            onChange={onTripDataChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}