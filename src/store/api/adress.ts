import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IAdress } from '../../models/adress';

export const addressAPI = createApi({
    reducerPath: 'addressAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://nominatim.openstreetmap.org/',
    }),
    endpoints: (build) => ({
        fetchCoordinates: build.query<IAdress[], string>({
            query: (address) => {
                const params = new URLSearchParams({
                    format: 'json',
                    q: address,
                    addressdetails: '1',
                });
                return {
                    url: `search?${params.toString()}`,
                    method: 'GET',
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                    },
                };
            },
        }),
    })
})