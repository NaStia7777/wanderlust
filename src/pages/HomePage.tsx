import { SavedRoutes } from '../components/home/SavedRoutes';
import { TripPlanner } from '../components/home/TripPlanner';

export function HomePage() {
  return (
    <div className="flex-grow">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SavedRoutes />
          <TripPlanner />
        </div>
      </div>
    </div>
  );
}