import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import prepareHeaders from './prepareHeaders';
import { ILoginRequest, IAuthResponse, IRegisterRequest } from '../../models/auth';

const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL + '/auth/',
        prepareHeaders,
    }),
    endpoints: (build)=>({
        register: build.mutation<IAuthResponse, IRegisterRequest>({
            query: (user)=> ({
                url: 'register/',
                method: 'POST',
                body: user
            })
        }),
        login: build.mutation<IAuthResponse, ILoginRequest>({
            query: (user)=> ({
                url: 'login/',
                method: 'POST',
                body: user
            })
        }),

    })
})

export default authAPI;