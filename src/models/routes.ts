
export interface IGetRoutesResponse {
    routes: IRoutePreview[];
    pages: number;
}

export interface IRoutePreview {
    id: number,
    url?: string,
    name: string;
    destinations: string;
    duration: string;
    price: number;
    places: string;
    routes?: string;
    backtrack?: boolean;
    coordinates?: string;
    start?: string;
    startdate?: string;
    ispublic: boolean;
}

export interface IRequestGetRoutes {
    name: string,
    categories: string[],
    budget?: number,
    duration?: number,
    page: number,
}