import { IMarker } from '../../models/places';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { createIcon, decodePolyline, FitMapBounds } from './TransportBlock';
import { generateColorFromId } from './PlaceBlock';
import { Route } from '../../models/directions';
interface IMIniRouteMapProps {
    startPoint: IMarker;
      endPoint: IMarker;
      route?: Route;
}
export default function MiniRouteMap({startPoint, endPoint, route}:IMIniRouteMapProps) {
    const markers = [startPoint, endPoint];
    return (
        <div className="my-4 h-48 bg-gray-100 rounded-lg">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={2}
                scrollWheelZoom={true}
                className='h-full w-full z-10'
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">Carto</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {markers.map((marker) => (
                    <Marker key={marker.xid} position={[marker.coord.lat, marker.coord.lon]}
                        icon={createIcon(generateColorFromId(marker.xid))}
                    >
                        <Popup>{marker.name}</Popup>
                    </Marker>
                ))}
                {route && (
                    <Polyline positions={decodePolyline(route.overview_polyline.points)} color={generateColorFromId(startPoint.xid)} />
                )}
                <FitMapBounds markers={markers} />
            </MapContainer>
        </div>
    )
}
