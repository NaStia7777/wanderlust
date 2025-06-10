import { DollarSign, CalendarClock, Tag, Image } from 'lucide-react';
import { ITripData } from '../../pages/AddRoutePage';
import { ChangeEvent } from 'react';

interface TripDataProps {
    data: ITripData,
    onParamChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function TripData({ data, onParamChange }: TripDataProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center mb-1">
                            <Image className="w-4 h-4 mr-1" />
                            Image url
                        </div>
                    </label>
                    <input
                        type="text"
                        name="image"
                        value={data.image}
                        onChange={onParamChange}
                        placeholder="Enter image url..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center mb-1">
                            <Tag className="w-4 h-4 mr-1" />
                            Name
                        </div>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={onParamChange}
                        placeholder="Enter name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center mb-1">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Budget
                        </div>
                    </label>
                    <input
                        type="number"
                        name="budget"
                        value={data.budget}
                        onChange={onParamChange}
                        placeholder="Enter budget in USD"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center mb-1">
                            <CalendarClock className="w-4 h-4 mr-1" />
                            Duration
                        </div>
                    </label>
                    <input
                        type="text"
                        name="duration"
                        value={data.duration}
                        onChange={onParamChange}
                        placeholder="How many days?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}