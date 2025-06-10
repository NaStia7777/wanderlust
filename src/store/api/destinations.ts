import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import prepareHeaders from './prepareHeaders';
import { IRequestGetDest, IResponseGetDest } from '../../models/destinations';


export const destinationsAPI = createApi({
    reducerPath: 'destinationsAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL + '/destinations/',
        // prepareHeaders,    
    }),
    endpoints: (build)=>({
        fetchDestinations: build.query<IResponseGetDest, IRequestGetDest>({
            query: (data) => {
                // Формуємо параметри запиту
                const params = new URLSearchParams();
                params.append('query', data.query);
                data.categories.forEach(category => params.append('categories[]', category.toString()));
                data.price.forEach(priceRange => params.append('price[]', priceRange));
                params.append('page', data.page.toString());

                return {
                    url: `?${params.toString()}`, // Додаємо параметри до URL
                    method: 'GET',
                };
            },
        })

    })
})