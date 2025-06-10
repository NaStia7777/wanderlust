import { MapPin } from 'lucide-react';
import { generateColorFromId } from './PlaceBlock';

interface StartPointBlockProps {
  name?: string;
  isStart?: boolean;
}

export function StartPointBlock({ name, isStart = true }: StartPointBlockProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-4 border-l-4'
      style={{
        borderColor: generateColorFromId(isStart ? 'startPoint' : 'endPoint'),
      }}
    >
      <div className="flex items-center">
        <MapPin className='w-5 h-5 mr-2' style={{color: generateColorFromId(isStart ? 'startPoint' : 'endPoint')}}/>
        <div>
          <h3 className="font-medium">{isStart ? 'Start Point' : 'Return to Start'}</h3>
          <p className={`text-sm text-${!name ? 'red' : 'gray'}-600`}>
            {!name ? "Select a starting point" : name}
          </p>
        </div>
      </div>
    </div>
  );
}