import { MapPin, Star, Calendar, Clock } from 'lucide-react';
import { IDestination } from '../../models/destinations';

interface DestinationCardProps {
  destination: IDestination;
  onPlanTrip: (id: number) => void;
}

export function DestinationCard({ destination, onPlanTrip }: DestinationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative">
        <img
          src={`https://images.unsplash.com/${destination.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`}
          alt={destination.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{destination.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">{destination.name}</h2>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{destination.location}</span>
            </div>
          </div>
          <span className="text-gray-600">{destination.price}</span>
        </div>

        <p className="text-gray-600 mb-4 md:h-[72px]">{destination.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {destination.category.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Best time: {destination.time}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{destination.duration}</span>
          </div>
        </div>

        <button
          onClick={() => onPlanTrip(destination.id)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Plan Trip
        </button>
      </div>
    </div>
  );
}