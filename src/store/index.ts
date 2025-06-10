import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import authAPI from "./api/auth";
import { categoriesAPI } from "./api/categories";
import { destinationsAPI } from "./api/destinations";
import { placesAPI } from "./api/places";
import { directionsAPI } from "./api/directions";
import { addressAPI } from "./api/adress";
import { routesAPI } from "./api/routes";

const rootReducer = combineReducers({
    authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [categoriesAPI.reducerPath]: categoriesAPI.reducer,
    [destinationsAPI.reducerPath]: destinationsAPI.reducer,
    [placesAPI.reducerPath]: placesAPI.reducer,
    [directionsAPI.reducerPath]: directionsAPI.reducer,
    [addressAPI.reducerPath]: addressAPI.reducer,
    [routesAPI.reducerPath]: routesAPI.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(authAPI.middleware, categoriesAPI.middleware, destinationsAPI.middleware, placesAPI.middleware, directionsAPI.middleware, addressAPI.middleware, routesAPI.middleware)
    })
}

export type TRootState = ReturnType<typeof rootReducer>
export type TAppStore = ReturnType<typeof setupStore>
export type TAppDispatch = TAppStore['dispatch']