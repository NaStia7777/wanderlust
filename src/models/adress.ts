export interface IPlaceAddress {
    state?: string;
    ISO3166_2_lvl4?: string;
    country?: string;
    country_code?: string;
    city?: string;
    municipality?: string;
    district?: string;
}

export interface IAdress {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    lat: string;
    lon: string;
    class: string;
    type: string;
    place_rank: number;
    importance: number;
    addresstype?: string;
    name?: string;
    display_name: string;
    address: IPlaceAddress;
    boundingbox: [string, string, string, string];
}
