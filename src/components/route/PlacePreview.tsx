import { Clock, Info, Star } from 'lucide-react';
import { IPlaceInfo } from '../../models/places';
import { generateColorFromId } from './PlaceBlock';


interface PlacePreviewProps {
    place: IPlaceInfo;
}

export function PlacePreview({ place }: PlacePreviewProps) {

    const style = {
        borderColor: generateColorFromId(place.xid),
    };

    const getDuration=(duration:number)=>{
        switch (duration){
            case 600: return '10 minutes';
            case 1800: return '30 minutes';
            case 60*60:return '1 hours';
            case  60 * 60 * 3: return '3 hours';
            default: return 'Full day';
        }
    }

    return (
        <div
            style={style}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-move border-l-4"
        >
            <div className="flex">
                <div className="w-32 h-32">
                    <img
                        src={place.preview?.source}
                        alt={place.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">{place.name}</h3>
                            <p className="text-sm text-gray-500">
                                {place?.address.city || place?.address.town || place?.address.village || place?.address.county}, {place?.address.country}
                            </p>
                            <label className="mt-4 block text-sm font-medium text-gray-700 mb-1">
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Duration: {getDuration(place.duration || 0)}
                                </div>
                            </label>
                        </div>
                        <div className='flex flex-col h-[95.2px] justify-between items-center'>
                            <div className="flex">
                                {Array.from({ length: Number(place?.rate[0]) }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                                ))}
                            </div>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Info className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}