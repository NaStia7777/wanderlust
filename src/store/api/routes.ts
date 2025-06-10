import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IRoutePreview, IGetRoutesResponse, IRequestGetRoutes } from '../../models/routes'; // Визначте ваші інтерфейси
import prepareHeaders from './prepareHeaders';

export const routesAPI = createApi({
    reducerPath: 'routesAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL + '/routes/',
        prepareHeaders, // Використовуйте, якщо потрібна передача токенів в заголовках
    }),
    endpoints: (build) => ({
        // Створення маршруту
        createRoute: build.mutation<void, Omit<IRoutePreview, 'id'>>({
            query: (route) => ({
                url: 'create',
                method: 'POST',
                body: route,
            }),
        }),

        // Видалення маршруту
        deleteRoute: build.mutation<void, number | undefined>({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
        }),

        // Оновлення маршруту
        editRoute: build.mutation<void, IRoutePreview>({
            query: (route) => ({
                url: `edit/`,
                method: 'PUT',
                body: route,
            }),
        }),

        // Отримання маршрутів користувача з пагінацією
        fetchUserRoutes: build.query<IGetRoutesResponse, number>({
            query: (page) => ({
                url: `get?page=${page}`,
                method: 'GET',
            }),
        }),

        // Отримання конкретного маршруту
        fetchRouteById: build.query<IRoutePreview, { id: number | undefined, isPublic: boolean }>({
            query: ({ id, isPublic }) => {
                if (isPublic)
                    return {
                        url: `public/${id}`,
                        method: 'GET',
                    };
                else
                    return {
                        url: `id/${id}`,
                        method: 'GET',
                    };
            },
        }),

        // Отримання всіх публічних маршрутів
        fetchPublicRoutes: build.query<IGetRoutesResponse, IRequestGetRoutes>({
            query: (data) => {
                // Формуємо параметри запиту
                const params = new URLSearchParams();
                params.append('name', data.name);
                data.categories.forEach(category => params.append('categories[]', category.toString()));
                if(data.budget) params.append('budget', data.budget.toString());
                if(data.duration) params.append('duration', data.duration.toString());
                params.append('page', data.page.toString());

                return {
                    url: `public?${params.toString()}`, // Додаємо параметри до URL
                    method: 'GET',
                };
            },
        }),
    }),
});