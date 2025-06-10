import { useState } from 'react';
import { Map } from 'lucide-react';
import { Pagination } from '../common/Pagination';
import { routesAPI } from '../../store/api/routes';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useApp';

export function SavedRoutes() {
  const [page, setPage] = useState<number>(1);
  const { data, isFetching, error } = routesAPI.useFetchUserRoutesQuery(page);
  const {role} = useAppSelector(state =>state.authReducer);
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Your Saved Routes</h2>
      <div className="space-y-4 mb-2">
        {isFetching ? Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse border rounded-lg p-4 w-full"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        )) : error ?
          <p className="mt-2 text-md text-red-600 text-center">An error occurred while loading</p> :
          <>
            {data && data.routes.map((route) => (
              <button key={route.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow w-full" 
              onClick={()=>{navigate(`..\\route\\${route.id}${role==='agency' ? '?isPublic=true' : '?isPublic=false'}`)}}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-left text-lg font-semibold">{route.name}</h3>
                    <p className="text-left text-gray-600 text-sm mt-1">
                      {route.destinations}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{route.duration}</span>
                      <span>{route.price}$</span>
                    </div>
                  </div>
                  <Map className="w-6 h-6 text-blue-600" />
                </div>
              </button>
            ))}
            {data?.routes.length === 0 &&
              <p className="mt-2 text-lg text-gray-600 text-center">You haven't saved any routes yet</p>
            }
            <Pagination page={page} pages={data?.pages || 1} setPage={(value) => setPage(value)} />
          </>
        }
      </div>
    </div>
  );
}