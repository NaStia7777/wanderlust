import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { MapPoint, RouteMap } from '../components/route/RouteMap';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ITripData, TripHeader } from '../components/route/TripHeader';
import { StartPointBlock } from '../components/route/StartPointBlock';
import { PlaceBlock } from '../components/route/PlaceBlock';
import { TransportBlock } from '../components/route/TransportBlock';
import { ISummary, RouteSummary } from '../components/route/RouteSummary';
import { AddPlaceForm } from '../components/route/AddPlaceForm/AddPlaceForm';
import { IPlaceInfo } from '../models/places';
import { Route } from '../models/directions';
import { useSearchParams } from 'react-router-dom';
import { routesAPI } from '../store/api/routes';

export function PlanRoutePage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data } = routesAPI.useFetchRouteByIdQuery({ id: id ? Number(id) : undefined, isPublic: searchParams.get('isPublic')==='true' });
  useEffect(() => {
    if (data) {
      setTripData({
        name: data.name,
        startPoint: data.start || '',
        startDate: data.startdate || '',
        backtrack: Boolean(data.backtrack || false),
        coordinates: data?.coordinates && data.coordinates!='' ? JSON.parse(data.coordinates) : undefined,
      });
      setRoutePlaces(JSON.parse(data.places));
    }
  }, [data]);
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [tripData, setTripData] = useState<ITripData>({
    startPoint: '',
    name: searchParams.get('name') || '',
    startDate: searchParams.get('startDate') || '',
    backtrack: true,
  });
  const [routePlaces, setRoutePlaces] = useState<IPlaceInfo[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [routes, setRoutes] = useState<(Route | undefined)[]>([]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRoutePlaces((items) => {
        const oldIndex = items.findIndex((item) => item.xid === active.id);
        const newIndex = items.findIndex((item) => item.xid === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmitAddPlaces = (places: IPlaceInfo[]) => {
    setRoutePlaces((prev) => {
      const uniquePlaces = places.filter(
        (place) => !prev.some((prevPlace) => prevPlace.xid === place.xid)
      );
      let array = uniquePlaces.map(item => ({ ...item, duration: 600 }));
      return [...prev, ...array];
    });
  }

  const handleTripDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTripData({
      ...tripData,
      [e.target.name]: e.target.value
    });
  };

  const handleBacktrackChange = (checked: boolean) => {
    setTripData(prev => ({ ...prev, backtrack: checked }));
    if (!checked && tripData.coordinates) setRoutes((prev) => prev.slice(0, -1));
  };

  const [showMap, setShowMap] = useState(false);

  const handleLocationUpdate = (address: string, coordinates: { lat: number; lon: number }) => {
    setTripData(prev => ({
      ...prev,
      startPoint: address,
      coordinates: coordinates,
    }));
  };

  function getPlaces(): MapPoint[] {
    let array: MapPoint[] = [];
    if (tripData.coordinates)
      array.push({ xid: 'startPoint', name: 'Start Point', point: tripData.coordinates });
    routePlaces.forEach(item => {
      array.push({ ...item });
    });
    return array;
  }

  function formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400); // Дні (1 день = 86400 секунд)
    const hrs = Math.floor((seconds % 86400) / 3600); // Години
    const mins = Math.floor((seconds % 3600) / 60); // Хвилини
    if (days === 0 && hrs === 0 && mins === 0) return '0 min';
    return `${days != 0 ? `${days} days` : ''}${hrs != 0 ? ` ${hrs} hrs` : ''}${mins != 0 ? ` ${mins} min` : ''}`;
  }

  function getSummary(): ISummary {
    let duration = 0;
    let price = 0;
    routes.forEach(route => {
      if (route) {
        duration += route.legs ? route.legs[0].duration.value : 0;
        price += route.legs ? route.legs[0].distance.value * 0.01 : 0;
      }
    })
    routePlaces.forEach(place => {
      if (place.duration)
        duration += place.duration;
    })
    const date = new Date(tripData.startDate);
    let endDate = '';

    // Перевірка на валідність дати
    if (!isNaN(date.getTime())) {
      date.setSeconds(date.getSeconds() + duration);
      endDate = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}-${date.getDate()}`
    }
    return {
      totalDuration: formatTime(duration),
      totalPrice: Number(price.toFixed(2)),
      endDate: endDate,
      places: routePlaces,
      routes: routes,
      ...tripData,
    };
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Plan Your Route</h1>

      <TripHeader
        tripData={tripData}
        onTripDataChange={handleTripDataChange}
        onBacktrackChange={handleBacktrackChange}
        onLocationUpdate={handleLocationUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Start Point */}
          <StartPointBlock name={tripData.coordinates ? tripData.startPoint : undefined} isStart={true} />
          {routePlaces.length > 0 && tripData.coordinates &&
            <TransportBlock
              id={0}
              startPoint={{ xid: 'startPoint', name: 'Start Point', coord: tripData.coordinates }}
              endPoint={{ xid: routePlaces[0].xid, name: routePlaces[0].name, coord: routePlaces[0].point }}
              setRoutes={setRoutes}
            />
          }
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={routePlaces.map(place => place.xid)}
              strategy={verticalListSortingStrategy}
            >
              {routePlaces.map((place, index) => (
                <Fragment key={place.xid}>
                  <PlaceBlock
                    setPlaces={setRoutePlaces}
                    place={place}
                    onRemove={() => setRoutes((prev) => prev.slice(0, -1))}
                  />
                  {index < routePlaces.length - 1 && (
                    <TransportBlock
                      id={index + 1}
                      startPoint={{ xid: place.xid, name: place.name, coord: place.point }}
                      endPoint={{ xid: routePlaces[index + 1].xid, name: routePlaces[index + 1].name, coord: routePlaces[index + 1].point }}
                      setRoutes={setRoutes}
                    />
                  )}
                </Fragment>
              ))}
            </SortableContext>
          </DndContext>
          {routePlaces.length === 0 &&
            <div className="flex items-center justify-center h-10">
              <p className='text-md text-red-600'>
                Add places to your route
              </p>
            </div>
          }
          {/* Return to Start Point */}
          {tripData.backtrack && (
            <>
              {routePlaces.length > 0 && tripData.coordinates &&
                <TransportBlock
                  id={routePlaces.length}
                  startPoint={{ xid: routePlaces[routePlaces.length - 1].xid, name: routePlaces[routePlaces.length - 1].name, coord: routePlaces[routePlaces.length - 1].point }}
                  endPoint={{ xid: 'endPoint', name: 'Start Point', coord: tripData.coordinates }}
                  setRoutes={setRoutes}
                />
              }
              <StartPointBlock name={tripData.coordinates ? tripData.startPoint : undefined} isStart={false} />
            </>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowAddPlaceForm(true)}
            className="w-full mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Place
          </button>
          {routePlaces.length > 0 && (
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
            summary={getSummary()}
          />
        </div>
      </div>

      {showAddPlaceForm && (
        <AddPlaceForm
          onClose={() => setShowAddPlaceForm(false)}
          onSubmit={handleSubmitAddPlaces}
        />
      )}
      {showMap && (
        <RouteMap
          routes={routes}
          places={getPlaces()}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}