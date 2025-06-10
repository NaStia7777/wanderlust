import { Fragment, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { routesAPI } from '../store/api/routes';
import { StartPointBlock } from '../components/route/StartPointBlock';
import MiniRouteMap from '../components/route/MiniRouteMap';
import { PlacePreview } from '../components/route/PlacePreview';
import { MapIcon } from 'lucide-react';
import { RouteSummary } from '../components/route/RouteSummary';
import { MapPoint, RouteMap } from '../components/route/RouteMap';
import { IPlaceInfo, IPoint } from '../models/places';
import { Route } from '../models/directions';

const RoutePage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [showMap, setShowMap] = useState(false);
    const isPublic = searchParams.get('isPublic') === 'true';
    const { data, error } = routesAPI.useFetchRouteByIdQuery({ id: id ? Number(id) : undefined, isPublic: isPublic });
    const places: IPlaceInfo[] | undefined = data ? JSON.parse(data.places) : undefined;
    const routes: (Route | undefined)[] | undefined = data?.routes && data.routes != '' ? JSON.parse(data.routes) : undefined;
    const coordinates: IPoint | undefined = data?.coordinates && data.coordinates != '' ? JSON.parse(data.coordinates) : undefined;
    function getPlaces(): MapPoint[] {
        let array: MapPoint[] = [];
        if (coordinates)
            array.push({ xid: 'startPoint', name: 'Start Point', point: coordinates });
        if (places)
            places.forEach(item => {
                array.push({ ...item });
            });
        return array;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Route {data?.name}</h1>
            {data && places &&
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {!isPublic && coordinates && routes &&  /* Start Point */
                            <>
                                <StartPointBlock name={data.start} isStart={true} />
                                <MiniRouteMap
                                    startPoint={{ xid: 'startPoint', name: 'Start Point', coord: coordinates }}
                                    endPoint={{ xid: places[0].xid, name: places[0].name, coord: places[0].point }}
                                    route={routes[0]}
                                />

                            </>
                        }
                        {places.map((place, index) => (
                            <Fragment key={place.xid}>
                                <PlacePreview place={place} />
                                {routes && index < places.length - 1 && routes[index+1] && (
                                    <MiniRouteMap
                                        startPoint={{ xid: place.xid, name: place.name, coord: place.point }}
                                        endPoint={{ xid: places[index + 1].xid, name: places[index + 1].name, coord: places[index + 1].point }}
                                        route={routes[index+1]}
                                    />
                                )}
                            </Fragment>
                        ))}
                        {/* Return to Start Point */}
                        {Boolean(data.backtrack) && (
                            <>
                                {coordinates && routes && routes[routes.length - 1] &&
                                    <MiniRouteMap
                                        startPoint={{ xid: places[places.length - 1].xid, name: places[places.length - 1].name, coord: places[places.length - 1].point }}
                                        endPoint={{ xid: 'endPoint', name: 'Start Point', coord: coordinates }}
                                        route={routes[routes.length - 1]}
                                    />
                                }
                                <StartPointBlock name={data.start} isStart={false} />
                            </>
                        )}
                    </div>

                    <div>
                        {!isPublic && data.routes && (
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowMap(true)}
                                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <MapIcon className="w-5 h-5" />
                                    View Route on Map
                                </button>
                            </div>
                        )}
                        <RouteSummary
                            summary={{
                                startDate: data.startdate,
                                totalPrice: data.price,
                                totalDuration: data.duration,
                                name: data.name,
                                places: places,
                                routes: [],
                                backtrack: Boolean(data.backtrack),
                                coordinates: coordinates,
                                startPoint: data.start || '',
                            }}
                            editable={false}
                        />
                    </div>
                </div>
            }
            {error &&
                <p className="mt-2 text-md text-red-600 text-center">An error occurred while loading</p>
            }
            {showMap && routes && (
                <RouteMap
                    routes={routes}
                    places={getPlaces()}
                    onClose={() => setShowMap(false)}
                />
            )}
        </div>
    )
}

export default RoutePage;