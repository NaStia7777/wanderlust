import { useState } from 'react';
import { Compass } from 'lucide-react';
import { useAppSelector } from '../../hooks/useApp';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const { isLogged, role } = useAppSelector(state => state.authReducer);
  const [data, setData] = useState<{name: string, date: string}>({name: '', date: ''});
  const navigate = useNavigate();
  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 text-center text-white px-4">
        <div className="flex items-center justify-center mb-6">
          <Compass className="w-12 h-12 mr-2" />
          <h1 className="text-4xl font-bold">Wanderlust</h1>
        </div>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Plan your perfect journey with our intuitive travel planning tools
        </p>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Where to?"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-md bg-white/90 text-gray-900"
              value={data.name}
              onChange={(e)=>setData(prev=>({...prev, name: e.target.value}))}
            />
            <input
              type="date"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-md bg-white/90 text-gray-900"
              value={data.date}
              onChange={(e)=>setData(prev=>({...prev, date: e.target.value}))}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors"
              onClick={() => {
                if (!isLogged) navigate('/login');
                else if (role === 'user') navigate(`/search?destination=${data.name}&startDate=${data.date}`);
                else navigate(`/add-route?name=${data.name}`);
              }}

            >
              Plan Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}