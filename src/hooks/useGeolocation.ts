import { useState } from 'react';

interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get address');
      }

      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village;
      const country = data.address.country;

      return {
        address: `${city}, ${country}`,
        coordinates: { latitude, longitude }
      };
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Please allow location access to use this feature');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case err.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
        }
      } else {
        setError('Failed to get your location');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCurrentLocation,
    isLoading,
    error
  };
}