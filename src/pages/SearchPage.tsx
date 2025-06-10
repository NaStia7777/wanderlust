import { ChangeEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchForm } from '../components/search/SearchForm';
import { SearchFilters } from '../components/search/SearchFilters';
import { DestinationCard } from '../components/search/DestinationCard';
import { CustomItineraryButton } from '../components/search/CustomItineraryButton';
import { categories } from '../data/categories';
import { routesAPI } from '../store/api/routes';
import { IRequestGetRoutes } from '../models/routes';
import { Pagination } from '../components/common/Pagination';

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParamsInit] = useSearchParams();
  const [searchParams, setSearchParams] = useState({
    destination: searchParamsInit.get('destination') || '',
    budget: searchParamsInit.get('budget') || '',
    days: searchParamsInit.get('days') || '',
    startDate: searchParamsInit.get('startDate') || ''
  });
  const [selectCategories, setSelectCategories] = useState<Set<string>>(new Set(categories.map(item => item.id)));
  const handleParamChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };
  const [page, setPage] = useState<number>(1);
  const getReq = (): IRequestGetRoutes => {
    const budget = Number(searchParams.budget);
    const duration = Number(searchParams.days);
    return {
      name: searchParams.destination,
      page: page,
      categories: Array.from(selectCategories),
      budget: isNaN(budget) ? undefined : budget,
      duration: isNaN(duration) ? undefined : duration,
    };
  }
  const { data, isFetching, error } = routesAPI.useFetchPublicRoutesQuery(getReq());

  const handleCreateCustomItinerary = () => {
    navigate(`/plan-route?name=${searchParams.destination}&startDate=${searchParams.startDate}`);
  };

  const isFormValid = searchParams.destination && searchParams.budget &&
    searchParams.days && searchParams.startDate;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Search Destinations</h1>
        <CustomItineraryButton
          onClick={handleCreateCustomItinerary}
          disabled={!isFormValid}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFilters
            selectCategories={selectCategories}
            setSelectCategories={setSelectCategories}
          />
        </div>

        <div className="lg:col-span-3">
          <SearchForm
            searchParams={searchParams}
            onParamChange={handleParamChange}
          />
        </div>
      </div>
      {isFetching ? <div className='h-40 w-full flex justify-center content-center'>
        <div className="border-gray-300 mr-2 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
      </div> :
        error ? <p className="mt-2 text-md text-red-600 text-center">An error occurred while loading</p> :
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data && data.routes.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>
            <Pagination page={page} setPage={(page)=>setPage(page)} pages={data?.pages || 0}/>
          </>
      }
    </div>
  );
}