import { Calendar } from 'lucide-react';

interface CustomItineraryButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CustomItineraryButton({ onClick, disabled }: CustomItineraryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3 rounded-md text-white transition-colors ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      <Calendar className="w-5 h-5" />
      <span>Create Custom Route</span>
    </button>
  );
}