import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExploreFilters } from '../components/explore/ExploreFilters';
import { DestinationCard } from '../components/explore/DestinationCard';
import { Pagination } from '../components/common/Pagination';
import { IRequestGetDest } from '../models/destinations';
import { destinationsAPI } from '../store/api/destinations';


export function ExplorePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IRequestGetDest>({
    query: '',
    categories: [],
    price: [],
    page: 1,
  });


  const handleFilterChange = (name: keyof typeof filters, value: string | string[] | number[] | number) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: (name !== 'page') ? 1 : value as number,
    }));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const { data } = destinationsAPI.useFetchDestinationsQuery(filters);

  const handlePlanTrip = (id: number) => {
    navigate('/plan-route');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Amazing Destinations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ExploreFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {data && data.destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onPlanTrip={handlePlanTrip}
              />
            ))}
          </div>
          {data && data.pages > 1 &&
            <Pagination pages={data.pages} page={filters.page} setPage={(page) => handleFilterChange('page', page)} />
          }
        </div>
      </div>
    </div>
  );
}