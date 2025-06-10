import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useApp';

export function TripPlanner() {
  const navigate = useNavigate();
  const { role } = useAppSelector(state => state.authReducer);
  const [planData, setPlanData] = useState({
    destination: '',
    startDate: '',
    budget: '',
    days: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === 'user')
      navigate(`/search?destination=${planData.destination}&startDate=${planData.startDate}&budget=${planData.budget}&days=${planData.days}`);
    else
      navigate(`/add-route?name=${planData.destination}&&budget=${planData.budget}&days=${planData.days}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlanData({
      ...planData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">{role === 'user' ? 'Plan Your Trip' : 'Create New Route'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Where do you want to go?
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={planData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-${role === 'user' ? 2 : 1} gap-4`}>
          {role === 'user' &&
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={planData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          }

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center mb-1">
                Number of days
              </div>
            </label>
            <input
              type="number"
              name="days"
              value={planData.days}
              onChange={handleChange}
              placeholder="How many days?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget (USD)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={planData.budget}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >

          {role === 'user' ? '  Search Destinations' : 'Create route'}
        </button>
      </form>
    </div>
  );
}