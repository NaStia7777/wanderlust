import { ChangeEvent, useEffect, useState } from 'react'
import { TripData } from '../components/route/TripData'
import { IPlaceInfo } from '../models/places';
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
import { PlaceBlock } from '../components/route/PlaceBlock';
import { AddPlaceForm } from '../components/route/AddPlaceForm/AddPlaceForm';
import RoutePreview from '../components/route/RoutePreview';
import { useSearchParams } from 'react-router-dom';
import { routesAPI } from '../store/api/routes';
export interface ITripData {
    image: string,
    name: string,
    budget: string,
    duration: string,
}

export default function AddRoutePage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const {data: route} = routesAPI.useFetchRouteByIdQuery({id: Number(id), isPublic: true});
    const [data, setData] = useState<ITripData>({
        image: '', 
        name: searchParams.get('name') || '', 
        budget: searchParams.get('budget') ||'', 
        duration: searchParams.get('days') ||'',
    });
    const [routePlaces, setRoutePlaces] = useState<IPlaceInfo[]>([]);
    useEffect(()=>{
        if(route){
            setData({
                image: route.url || '',
                name: route.name,
                budget: route.price.toString(),
                duration: route.duration,
            });
            setRoutePlaces(JSON.parse(route.places));
        }
    }, [route]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
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
    const handleParamChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
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

    const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Add New Route</h1>
            <div className="w-full">
                <TripData data={data} onParamChange={handleParamChange} />
                {/* <div className="bg-white rounded-lg shadow-md mb-3 pb-4">
                        <img
                            src={data.image}
                            alt={data.name}
                            className="w-full h-32 object-cover"
                        />
                        <h2 className="text-base font-bold text-center h-[56px]">{data.name}</h2>
                    </div> */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={routePlaces.map(place => place.xid)}
                            strategy={verticalListSortingStrategy}
                        >
                            {routePlaces.map(place => (
                                <PlaceBlock
                                    setPlaces={setRoutePlaces}
                                    place={place}
                                    onRemove={() => { }}
                                    key={place.xid}
                                />
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
                </div>
                <div>
                    <button
                        onClick={() => setShowAddPlaceForm(true)}
                        className="w-full mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Place
                    </button>
                    <RoutePreview data={data} places={routePlaces}/>
                </div>
            </div>
            {showAddPlaceForm && (
                <AddPlaceForm
                    onClose={() => setShowAddPlaceForm(false)}
                    onSubmit={handleSubmitAddPlaces}
                />
            )}
        </div>
    )
}
