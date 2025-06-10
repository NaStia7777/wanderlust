import { useEffect, useState } from 'react'
import { ITripData } from '../../pages/AddRoutePage'
import { IPlaceInfo } from '../../models/places'
import { Star } from 'lucide-react';
import { categories } from '../../data/categories';
import { getAllChildIds } from './AddPlaceForm/logic';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routesAPI } from '../../store/api/routes';

export const getRate = (places: IPlaceInfo[]) => {
    let rate = 0;
    places.forEach(place => {
        rate += Number(place.rate[0]);
    })
    if (places.length != 0) rate /= places.length;
    return rate.toFixed(1);
}


export interface IRoutePreviewProps {
    data: ITripData,
    places: IPlaceInfo[],
}

export default function RoutePreview({ data, places }: IRoutePreviewProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [create, { isLoading: isLoadingCreate, error: errorCreate }] = routesAPI.useCreateRouteMutation();
    const [edit, { isLoading: isLoadingEdit, error: errorEdit }] = routesAPI.useEditRouteMutation();
    
    const getCategories = () => {
        const kinds = places.map(place => place.kinds).join(',');
        let cats: string[] = [];
        categories.forEach(category => {
            let all = getAllChildIds(category);
            if (all.some(cat => kinds.includes(cat)))
                cats.push(category.name);
        })
        return cats;
    }
    const getError = (): string | undefined => {
        if (data.name === '') return 'Enter name of the route';
        if (data.duration === '') return 'Enter duration of the route';
        const budget = Number(data.budget);
        if (isNaN(budget) || budget < 0) return 'Enter valid budget';
        if (places.length === 0) return 'Add places to your route'
        return undefined;
    }
    const [errorMessage, setErrorMessage] = useState<string | undefined>(getError());

    const checkImageValidity = (url: string): void => {
        const img = new Image();
        // Помилка завантаження
        img.onerror = () => setErrorMessage('Enter valid image url');
        img.src = url;
    };

    useEffect(() => {
        setErrorMessage(getError());
        checkImageValidity(data.image);
    }, [data, places]);

    const onSave = async () => {
        const dests: string[] = [];
        places.forEach(place => {
            const city = (place.address.city || place.address.town || place.address.village || place.address.county || place.address.state);
            if (dests.length === 0 || dests[dests.length - 1] !== city)
                dests.push(city);
        });
        const routeData = {
            url: data.image,
            name: data.name,
            destinations: dests.join(' → '),
            duration: data.duration,
            price: Number(data.budget),
            places: JSON.stringify(places),
            ispublic: true,
        }
        const id = searchParams.get('id');
        if (id) {
            await edit({ id: Number(id), ...routeData }).then(() => navigate('/home'));
        }
        else {
            await create(routeData).then(() => navigate('/home'));
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Route Preview</h2>
            <img
                src={data.image}
                alt={data.name}
                className="w-[276.5px] h-48 object-cover"
            />
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold overflow-hidden">{data.name}</h2>
                    <div className="flex items-center ml-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1">{getRate(places)}</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {getCategories().map((feature, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                            {feature}
                        </span>
                    ))}
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{data.duration}</span>
                    {data.budget != '' && <span>{data.budget}$</span>}
                </div>

            </div>
            <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                disabled={errorMessage != undefined}
                onClick={onSave}
            >
                {isLoadingCreate || isLoadingEdit ?
                    <div className="border-gray-300 mr-2 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
                    :
                    <>Save Route</>
                }
            </button>
            {errorCreate && errorEdit &&
                <p className="mt-2 text-md text-red-600 text-center">There was an error saving the route</p>
            }
            {errorMessage &&
                <p className="mt-2 text-md text-red-600 text-center">{errorMessage}</p>
            }
        </div>
    )
}
