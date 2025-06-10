import { Star, Check, Plus } from "lucide-react";
import { placesAPI } from "../../../store/api/places";
import { IPlaceInfo } from "../../../models/places";

export interface IPlaceCardProps {
    selectedPlaces: IPlaceInfo[],
    onToggle: (place?: IPlaceInfo) => void,
    xid: string,
}

export default function PlaceCard({ selectedPlaces, onToggle, xid, }: IPlaceCardProps) {
    const { data: placeInfo, isFetching, error } = placesAPI.useFetchPlaceInfoQuery(xid);
    const selected = selectedPlaces.some(place => place.xid === xid);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-32">
                {isFetching ? (
                    <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500 text-sm">
                        Error loading data
                    </div>
                ) : (
                    <img
                        src={placeInfo?.preview?.source}
                        alt={placeInfo?.name}
                        className="w-full h-full object-cover"
                    />
                )}
                {!isFetching && !error && (
                    <div className="absolute top-2 right-2 flex items-center bg-white/90 rounded-full px-2 py-1">
                        {Array.from({ length: Number(placeInfo?.rate[0]) }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400" />
                        ))}
                    </div>
                )}
            </div>
            <div className="p-4">
                {isFetching ? (
                    <>
                        <div className="h-5 bg-gray-300 rounded animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-300 rounded animate-pulse mb-1"></div>
                        <div className="h-10 bg-gray-300 rounded animate-pulse mb-3"></div>
                        <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                    </>
                ) : error ? (
                    <div className="text-center text-red-500 text-sm">
                        An error occurred
                    </div>
                ) : (
                    <>
                        <h3 className="font-semibold mb-1">{placeInfo?.name}</h3>
                        <p className="text-sm text-black-500 mb-1">
                            {placeInfo?.address.city || placeInfo?.address.town || placeInfo?.address.village || placeInfo?.address.county}, {placeInfo?.address.country}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{placeInfo?.wikipedia_extracts?.text}</p>
                        <button
                            onClick={() => onToggle(placeInfo)}
                            className="w-full flex items-center justify-center space-x-2 py-2 rounded-md transition-colors"
                            style={{
                                backgroundColor: selected ? '#e6f3ff' : '#f3f4f6',
                                color: selected ? '#2563eb' : '#4b5563',
                            }}
                        >
                            {selected ? (
                                <Check className="w-5 h-5 transition-transform duration-200 ease-spring" />
                            ) : (
                                <Plus className="w-5 h-5 transition-transform duration-200 ease-spring" />
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}