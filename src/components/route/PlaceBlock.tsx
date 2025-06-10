import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Clock, Star, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IPlaceInfo } from '../../models/places';

export function generateColorFromId(id: string): string {
  // Хешування ID в числове значення
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Генерація кольору в форматі HEX
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }

  return color;
}

interface PlaceBlockProps {
  place: IPlaceInfo;
  setPlaces: Dispatch<SetStateAction<IPlaceInfo[]>>;
  onRemove: ()=>void;
}

export function PlaceBlock({ place, setPlaces, onRemove }: PlaceBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: place.xid });


  function handleChange(event: ChangeEvent<HTMLSelectElement>): void {
    setPlaces(prev => prev.map(item => {
      if (item.xid === place.xid)
        return { ...item, duration: Number(event.target.value) };
      else return item;
    }))
  }
  const handleRemovePlace = () => {
    onRemove();
    setPlaces(places => places.filter(item => item.xid !== place.xid));
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderColor: generateColorFromId(place.xid),
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-move border-l-4"
      {...attributes}
      {...listeners}
    >
      <div className="flex">
        <div className="w-32 h-32">
          <img
            src={place.preview?.source}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{place.name}</h3>
              <p className="text-sm text-gray-500">
                {place?.address.city || place?.address.town || place?.address.village || place?.address.county}, {place?.address.country}
              </p>
              <div className='mt-4 flex flex-row items-center'>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Duration
                  </div>
                </label>
                <select
                  name="duration"
                  value={place?.duration}
                  onChange={handleChange}
                  className="ml-2 px-3 py-1 border border-gray-300 rounded-md"
                  required
                >
                  <option value={600}>10 minutes</option>
                  <option value={60 * 30}>30 minutes</option>
                  <option value={60 * 60}>1 hours</option>
                  <option value={60 * 60 * 3}>3 hours</option>
                  <option value={60 * 60 * 24}>Full day</option>
                </select>
              </div>
            </div>
            <div className='flex flex-col h-[95.2px] justify-between items-center'>
              <div className="flex">
                {Array.from({ length: Number(place?.rate[0]) }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <button
                onClick={handleRemovePlace}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}