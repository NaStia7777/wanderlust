import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPlace, IPlaceInfo, IRequestGetPlaces } from '../../models/places';

export const placesAPI = createApi({
    reducerPath: 'placesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.opentripmap.com/0.1/',
    }),
    endpoints: (build) => ({
        fetchPlaces: build.query<IPlace[], IRequestGetPlaces>({
            query: (data) => {
                const language = 'en';
                const params = new URLSearchParams();
                params.append('lon_min', String(data.boundingBox.lon_min));
                params.append('lon_max', String(data.boundingBox.lon_max));
                params.append('lat_min', String(data.boundingBox.lat_min));
                params.append('lat_max', String(data.boundingBox.lat_max));
                params.append('kinds', data.kinds);
                if (data.name != '')
                    params.append('name', data.name);
                params.append('format', 'json');
                params.append('apikey', import.meta.env.VITE_OPENTRIPMAP_APIKEY);
                return {
                    url: `${language}/places/bbox?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        fetchPlaceInfo: build.query<IPlaceInfo, string>({
            query: (xid) => {
                const language = 'en';
                return {
                    url: `${language}/places/xid/${xid}?apikey=${import.meta.env.VITE_OPENTRIPMAP_APIKEY}`,
                    method: 'GET',
                };
            },
        })

    })
})