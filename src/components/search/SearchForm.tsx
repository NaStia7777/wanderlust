import { ChangeEvent } from 'react';
import { Search, Calendar, DollarSign, CalendarClock } from 'lucide-react';

interface SearchFormProps {
  searchParams: {
    destination: string;
    budget: string;
    days: string;
    startDate: string;
  };
  onParamChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function SearchForm({ searchParams, onParamChange }: SearchFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center mb-1">
              <Search className="w-4 h-4 mr-1" />
              Destination
            </div>
          </label>
          <input
            type="text"
            name="destination"
            value={searchParams.destination}
            onChange={onParamChange}
            placeholder="Where do you want to go?"
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
            value={searchParams.budget}
            onChange={onParamChange}
            placeholder="Enter budget in USD"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              Start date
            </div>
          </label>
          <input
              type="date"
              id="startDate"
              name="startDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchParams.startDate}
              onChange={onParamChange}
              required
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center mb-1">
              <CalendarClock className="w-4 h-4 mr-1" />
              Number of days
            </div>
          </label>
          <input
            type="number"
            name="days"
            value={searchParams.days}
            onChange={onParamChange}
            placeholder="How many days?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}