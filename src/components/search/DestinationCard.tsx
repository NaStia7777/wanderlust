import { Star } from 'lucide-react';
import { IRoutePreview } from '../../models/routes';
import { getRate } from '../route/RoutePreview';
import { categories } from '../../data/categories';
import { getAllChildIds } from '../route/AddPlaceForm/logic';
import { useNavigate } from 'react-router-dom';
import { IPlaceInfo } from '../../models/places';

interface DestinationCardProps {
  destination: IRoutePreview,
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const places : IPlaceInfo[] = JSON.parse(destination.places);

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
  const navigate = useNavigate();

  return (
    <button className="bg-white rounded-lg shadow-md overflow-hidden" onClick={()=>navigate(`/route/${destination.id}?isPublic=true`)}>
      <img
        src={destination.url}
        alt={destination.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{destination.name}</h2>
          </div>
          <div className="flex items-center">
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
          <span>{destination.duration}</span>
          <span>{destination.price}$</span>
        </div>
      </div>
    </button>
  );
}