export interface IPlace {
    xid: string;
    name: string;
    rate: number;
    osm: string;
    wikidata: string;
    kinds: string;
    point: IPoint;
}

export interface IPoint {
    lon: number;
    lat: number;
}


export interface IRequestGetPlaces {
    kinds: string,
    name: string,
    boundingBox: IBoundingBox,
}


export interface IAddress {
    state: string;
    county?: string;
    country: string;
    village?: string;
    town?: string,
    city?: string,
    country_code: string;
}

export interface IBoundingBox {
    lon_min: number;
    lon_max: number;
    lat_min: number;
    lat_max: number;
}

export interface ISources {
    geometry: string;
    attributes: string[];
}

export interface IPreview {
    source: string;
    height: number;
    width: number;
}

export interface IWikipediaExtracts {
    title: string;
    text: string;
    html: string;
}

export interface IPlaceInfo {
    xid: string;
    name: string;
    address: IAddress;
    rate: string;
    osm: string;
    bbox: IBoundingBox;
    wikidata: string;
    kinds: string;
    sources: ISources;
    otm: string;
    wikipedia: string;
    image: string;
    preview?: IPreview;
    wikipedia_extracts?: IWikipediaExtracts;
    point: IPoint;
    duration?: number,
}

export interface IMarker {
    xid: string,
    name: string, 
    coord: IPoint,
}