export interface IDestination {
    id: number,
    name: string;
    location: string;
    image: string;
    description: string;
    category: string[];
    rating: number;
    price: string;
    time: string;
    duration: string;
    lat: number,
    lng: number,
}
export interface IRequestGetDest {
    query: string,
    categories: number[],
    price: string[],
    page: number,
}

export interface IResponseGetDest {
    destinations: IDestination[],
    pages: number,
}

