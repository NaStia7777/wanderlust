import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IDirectionsResponse, IRequestGetDirections } from '../../models/directions';

export const directionsAPI = createApi({
    reducerPath: 'directionsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://google-map-places.p.rapidapi.com/maps/api/directions/json',
        prepareHeaders: (headers) => {
            headers.set('x-rapidapi-key', import.meta.env.VITE_GOOGLEMAP_APIKEY);
            headers.set('x-rapidapi-host', 'google-map-places.p.rapidapi.com');
            return headers;
        },
    }),
    endpoints: (build) => ({
        fetchDirections: build.query<IDirectionsResponse, IRequestGetDirections>({
            query: (params) => {
                const searchParams = new URLSearchParams({
                    origin: `${params.origin.lat},${params.origin.lon}`,
                    destination: `${params.destination.lat},${params.destination.lon}`,
                    departure_time: String(Math.floor(Date.now() / 1000) + 10 * 60),
                    traffic_model: 'pessimistic',
                    alternatives: 'false',
                    units: 'metric',
                    mode: params.mode,
                    language: 'en',
                });
                return {
                    url: `?${searchParams.toString()}`,
                    method: 'GET',
                };
            },
        }),
    }),
});