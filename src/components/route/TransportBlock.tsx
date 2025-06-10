import { Dispatch, ElementType, SetStateAction, useEffect, useState } from 'react';
import { Bus, Car, Footprints, Clock, DollarSign } from 'lucide-react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import 'leaflet/dist/leaflet.css';
import { IMarker } from '../../models/places';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { generateColorFromId } from './PlaceBlock';
import { directionsAPI } from '../../store/api/directions';

import polyline from '@mapbox/polyline';
import { Route } from '../../models/directions';

export const decodePolyline = (encoded: string): [number, number][] => {
  return polyline.decode(encoded).map(([lat, lng]) => [lat, lng]);
};

export const FitMapBounds = ({ markers }: { markers: IMarker[] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.coord.lat, marker.coord.lon]));
      map.fitBounds(bounds, { padding: [50, 50] }); // Додаткові відступи для гарного вигляду
    }
  }, [markers, map]);

  return null;
};

export function createIcon(color: string) {
  const svgIcon = `
    <svg viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" width="30" height="50">
      <path fill="${color}" d="m172.268 501.67c-145.298-210.639-172.268-232.257-172.268-309.67 0-106.039 85.961-192 192-192s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zm19.732-229.67c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  `;

  return new L.DivIcon({
    html: svgIcon,  // Вставляємо SVG в якості HTML
    iconSize: [30, 50], // Розміри маркера
    iconAnchor: [15, 50],  // Центруємо маркер по координатах
    popupAnchor: [1, -34], // Розташування спливаючого вікна
    className: 'border-none bg-transparent'
  });
};


interface TransportOption {
  id: string;
  icon: ElementType;
  name: string;
  duration: string;
  price: number;
}

interface TransportBlockProps {
  id: number;
  startPoint: IMarker;
  endPoint: IMarker;
  setRoutes: Dispatch<SetStateAction<(Route | undefined)[]>>,
}

export function TransportBlock({ id, setRoutes, startPoint, endPoint }: TransportBlockProps) {
  const markers = [startPoint, endPoint];
  const [transport, setTransport] = useState<TransportOption[]>([]);
    const {data: carData, isFetching: isCarFetching} = directionsAPI.useFetchDirectionsQuery({origin:startPoint.coord, destination: endPoint.coord, mode: 'driving'});
    const {data: walkData, isFetching: isWalkFetching} = directionsAPI.useFetchDirectionsQuery({origin:startPoint.coord, destination: endPoint.coord, mode: 'walking'});
    const data = [carData, walkData];
    
    useEffect(()=>{
      if(carData && walkData && carData.routes.length>0 && carData.routes[0].legs && walkData.routes[0].legs){
        const temp = [{id: '0', icon: Car, name: 'Car', duration: carData.routes[0].legs[0].duration.text, price: Number((carData.routes[0].legs[0].distance.value*0.01).toFixed(2))}];
        if(walkData.routes.length>0 && walkData.routes[0].legs[0].duration.value<4*3600){
          temp.push({id: '1', icon: Footprints, name: 'On Foot', duration: walkData.routes[0].legs[0].duration.text, price: 0})
        }
        temp.push({ id: '2', icon: Bus, name: 'Public Transport', duration: '', price: 0 });
        setTransport(temp);
        setRoutes(prev=>{
          let routes=[...prev];
          routes[id]={...carData.routes[0]};
          return routes;
        })
      }
      else {
        setTransport([{ id: '2', icon: Bus, name: 'Public Transport', duration: '', price: 0 }]);
        setRoutes(prev=>{
          let routes=[...prev];
          routes[id]=undefined;
          return routes;
        })
      }
    }, [isCarFetching, isWalkFetching]);
  return (
    <div className="my-4">
      {isCarFetching || isWalkFetching ?
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded-lg"></div>
          <div className="h-48 bg-gray-300 rounded-lg"></div>
        </div> :
        <TabGroup>
          <TabList className="flex space-x-2 rounded-xl bg-blue-900/10 p-1">
            {transport.map((option) => (
              <Tab
                key={option.id}
                className={({ selected }) => `
                w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                  }
              `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <option.icon className="w-4 h-4" />
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{option.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{option.price}</span>
                  </div>
                </div>
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2">
            {transport.map((option, index) => (
              <TabPanel
                key={option.id}
                className="rounded-xl bg-white p-3 shadow-md"
              >
                <div className="h-48 bg-gray-100 rounded-lg">
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
                    {data[index] && data[index].routes.length>0 && (
                      <Polyline positions={decodePolyline(data[index].routes[0].overview_polyline.points)} color={generateColorFromId(startPoint.xid)} />
                    )}
                    <FitMapBounds markers={markers} />
                  </MapContainer>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      }
    </div>
  );
}