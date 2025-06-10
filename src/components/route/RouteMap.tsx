import { useEffect } from 'react';
import { X, Map as MapIcon } from 'lucide-react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Route } from '../../models/directions';
import { IPoint } from '../../models/places';
import { createIcon, decodePolyline } from './TransportBlock';
import { generateColorFromId } from './PlaceBlock';
import L from 'leaflet';

export interface MapPoint {
  xid: string;
  name: string;
  point: IPoint;
}

interface RouteMapProps {
  routes: (Route | undefined)[];
  places: MapPoint[];
  onClose: () => void;
}
const FitMapBounds = ({ markers }: { markers: MapPoint[] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.point.lat, marker.point.lon]));
      map.fitBounds(bounds, { padding: [50, 50] }); // Додаткові відступи для гарного вигляду
    }
  }, [markers, map]);

  return null;
};

export function RouteMap({ routes, places, onClose }: RouteMapProps) {
  return (
    <div className="fixed inset-4 z-50 bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gray-100">
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <MapIcon className="w-5 h-5 mr-2" />
            Route Map
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-0 top-[65px]">
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
            {routes.map((route, index) => {
              if (route)
                return (<Polyline positions={decodePolyline(route.overview_polyline.points)} color={generateColorFromId(places[index].xid)} />);
              else return null;
            }
            )}
            {places.map((marker, index) => (
              <Marker key={marker.xid} position={[marker.point.lat, marker.point.lon]}
                icon={createIcon(generateColorFromId(marker.xid))}
              >
                <Popup>{`${index+1}. ${marker.name}${marker.xid==='startPoint' && places.length===routes.length ? `\n ${places.length+1}. End Point` : ''}`}</Popup>
              </Marker>
            ))}
            <FitMapBounds markers={places} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
