import { Calendar, DollarSign, Clock } from 'lucide-react';
import { IPlaceInfo, IPoint } from '../../models/places';
import { Route } from '../../models/directions';
import { routesAPI } from '../../store/api/routes';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useApp';

export interface ISummary {
  startDate?: string;
  endDate?: string;
  totalPrice: number;
  totalDuration: string;
  name: string;
  places: IPlaceInfo[];
  routes: (Route | undefined)[];
  backtrack: boolean,
  coordinates?: IPoint,
  startPoint: string,
}
interface RouteSummaryProps {
  summary: ISummary,
  editable?: Boolean,
}

export function RouteSummary({ summary, editable = true }: RouteSummaryProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [create, { isLoading: isLoadingCreate, error: errorCreate }] = routesAPI.useCreateRouteMutation();
  const [edit, { isLoading: isLoadingEdit, error: errorEdit }] = routesAPI.useEditRouteMutation();
  const [deleteRoute, { isLoading: isLoadingDelete, error: errorDelete }] = routesAPI.useDeleteRouteMutation();
  
  const getError = (): string | undefined => {
    if (!summary.coordinates || summary.startPoint === '') return 'Enter the starting address';
    if (summary.name === '') return 'Enter name of the route';
    const date = new Date(summary.startDate || '');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime()) || date < today) return 'Enter valid start date';
    if (summary.places.length === 0) return 'Add places to your route'
    return undefined;
  }
  const errorMessage = getError();

  const isPublic = searchParams.get('isPublic') === 'true';
  const onSave = async () => {
    const places: string[] = [];
    summary.places.forEach(place => {
      const city = (place.address.city || place.address.town || place.address.village || place.address.county || place.address.state);
      if (places.length === 0 || places[places.length - 1] !== city)
        places.push(city);
    });
    let routes: (Route | undefined)[] = [...summary.routes];
    routes.forEach(route => {
      if (route) {
        Object.keys(route).forEach((key) => {
          if (key !== "overview_polyline") {
            delete route[key as keyof typeof route];
          }
        });
      }
    });
    const data = {
      name: summary.name,
      start: summary.startPoint,
      destinations: places.join(' → '),
      duration: summary.totalDuration,
      price: summary.totalPrice,
      places: JSON.stringify(summary.places),
      routes: JSON.stringify(routes),
      backtrack: summary.backtrack,
      coordinates: JSON.stringify(summary.coordinates),
      startdate: summary.startDate,
      ispublic: false,
    }
    const id = searchParams.get('id');
    if (id && !isPublic) {
      await edit({ id: Number(id), ...data }).then(() => navigate('/home'));
    }
    else {
      await create(data).then(() => navigate('/home'));
    }
  }

  const getControl = () => {
    if (editable) {
      return (<>
        <button
          onClick={onSave}
          className="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={Boolean(errorMessage) || isLoadingCreate || isLoadingEdit}
        >
          {isLoadingCreate || isLoadingEdit ?
            <div className="border-gray-300 mr-2 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
            :
            <>Save Route</>
          }
        </button>
        {errorCreate && errorEdit &&
          <p className="mt-2 text-md text-red-600 text-center">There was an error saving the route</p>
        }
        {errorMessage &&
          <p className="mt-2 text-md text-red-600 text-center">{errorMessage}</p>
        }
      </>);
    }
    else {
      const params = useParams();
      const navigate = useNavigate();
      const { role } = useAppSelector(state => state.authReducer);
      return (<>
        <button
          onClick={() => navigate(role === 'agency' ? `/add-route?id=${params.id}` : `/plan-route?id=${params.id}&isPublic=${isPublic || false}`)}
          className="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Route
        </button >
        {!(role === 'user' && isPublic) &&
          <button
            onClick={() => {
              deleteRoute(Number(params.id)).then(() => navigate('/home'));
            }}
            className="w-full mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            {isLoadingDelete ?
              <div className="border-gray-300 mr-2 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
              :
              <>Delete Route</>
            }
          </button >
        }

        {errorDelete &&
          <p className="mt-2 text-md text-red-600 text-center">There was an error delete the route</p>
        }
      </>)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <h2 className="text-xl font-bold mb-4">Route Summary</h2>
      <div className="space-y-4">
        {summary.startDate &&
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{summary.endDate ? 'Duration' : 'Start Date'}</span>
            </div>
            <span>{summary.startDate} {summary.endDate && `- ${summary.endDate}`}</span>
          </div>
        }
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Total Time</span>
          </div>
          <span>{summary.totalDuration}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>Total Cost</span>
          </div>
          <span>{summary.totalPrice}$</span>
        </div>
      </div>
      {getControl()}
    </div>
  );
}