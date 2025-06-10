import { PopularDestinations } from '../components/main/PopularDestinations';
import { PlanningTools } from '../components/main/PlanningTools';
import { Hero } from '../components/main/Hero';

export function MainPage() {
  return (
    <div className="flex-grow">
      <Hero />
      <PlanningTools />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PopularDestinations />
      </div>
    </div>
  );
}