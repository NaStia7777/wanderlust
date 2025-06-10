import { LucideIcon } from 'lucide-react';

interface PlanningToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function PlanningToolCard({ icon: Icon, title, description, onClick }: PlanningToolCardProps) {
  return (
    <div 
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}