import { useNavigate } from 'react-router-dom';
import { PlanningToolCard } from './PlanningToolCard';
import { tools } from '../../data/tools';

export function PlanningTools() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Travel Planning Tools</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to plan the perfect trip. Our comprehensive suite of travel tools 
            helps you organize, plan, and make the most of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <PlanningToolCard
              key={index}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              onClick={() => navigate(tool.path)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}