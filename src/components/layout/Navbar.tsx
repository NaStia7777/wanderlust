import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { NavLink } from './NavLink';
import { useAppDispatch, useAppSelector } from '../../hooks/useApp';
import { clearTokens } from '../../store/slices/auth';

export function Navbar() {
  const navigate = useNavigate();
  const { isLogged, role } = useAppSelector(state => state.authReducer);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(clearTokens());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Wanderlust</span>
          </Link>

          {isLogged ? (
            <div className="flex items-center space-x-6">
              <NavLink to="/home">Home</NavLink>
              {role === 'user' ?
                <>
                  <NavLink to="/explore">Explore</NavLink>
                  <NavLink to="/search">Search</NavLink>
                </> :
                <>
                <NavLink to="/add-route">Create route</NavLink>
                </>

              }

              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}