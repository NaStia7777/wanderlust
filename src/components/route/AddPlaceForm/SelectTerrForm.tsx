import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { X, Search, MapPinned } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { addressAPI } from '../../../store/api/adress';
import { IBoundingBox } from '../../../models/places';
import L from 'leaflet';

interface SelectTerrFormProps {
    onClose: () => void;
    boundingbox: IBoundingBox,
    setBoundingBox: Dispatch<SetStateAction<IBoundingBox>>,
}

const FitMapBounds = ({ boundingbox }: { boundingbox: IBoundingBox }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([[boundingbox.lat_min, boundingbox.lon_min], [boundingbox.lat_max, boundingbox.lon_max]]);
        map.fitBounds(bounds, { padding: [0, 0] }); // Додаткові відступи для гарного вигляду
    }, [boundingbox]);

    return null;
};

export function SelectTerrForm({ onClose, boundingbox, setBoundingBox }: SelectTerrFormProps) {

    const [searchTerm, setSearchTerm] = useState('');
    const [address, setAdress] = useState('');
    const { data } = addressAPI.useFetchCoordinatesQuery(address);
    const selectTerr = (bounds: [string, string, string, string]) => {
        const lat_min = Number(bounds[0]);
        const lon_min = Number(bounds[2]);
        const lat_max = Number(bounds[1]);
        const lon_max = Number(bounds[3]);
        setBoundingBox({
            lat_min: lat_min < -89 ? -89 : lat_min,
            lat_max: lat_max > 89 ? 89 : lat_max,
            lon_min: lon_min < -179 ? -179 : lon_min,
            lon_max: lon_max > 179 ? 179 : lon_max,
        });
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">Select Territory</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-88px)]">
                    {/* Left Column - Search */}
                    <div className="lg:col-span-1 border-r flex flex-col h-[calc(90vh-88px)]">
                        <div className="p-6 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setAdress(searchTerm);
                                        }
                                    }}
                                    placeholder="Search territory..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                                />
                                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                        {data &&
                            <>
                                <h3 className="font-semibold my-2 ml-6">Results</h3>

                                <div className="flex-1 max-h-full overflow-y-auto px-6">
                                    {data.map((item, index) =>
                                        <div className='bg-white rounded-lg shadow-md p-4 m-2' key={index}>
                                            <div className="flex flex-row justify-between">
                                                <p className={`text-md text-gray-600`}>
                                                    {item.display_name}
                                                </p>
                                                <button
                                                    onClick={() => selectTerr(item.boundingbox)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <MapPinned className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        }

                    </div>

                    {/* Right Column - Map */}
                    <div className="lg:col-span-2 overflow-y-auto">
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={2}
                            scrollWheelZoom={true}
                            className='h-full w-full'
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/">Carto</a>'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            <FitMapBounds boundingbox={boundingbox} />
                        </MapContainer>
                    </div>

                </div>
            </div>
        </div>
    );
}