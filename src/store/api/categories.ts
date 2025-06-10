import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import prepareHeaders from './prepareHeaders';
import { ICategory } from '../../models/categories';


export const categoriesAPI = createApi({
    reducerPath: 'categoriesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL + '/categories/',
        // prepareHeaders,    
    }),
    endpoints: (build)=>({
        fetchCategories: build.query<ICategory[], void>({
            query: () => ({
                url: '',
            })
        })

    })
})