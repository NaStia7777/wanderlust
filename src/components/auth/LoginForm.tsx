import { useNavigate } from 'react-router-dom';
import authAPI from '../../store/api/auth';
import { IAuthResponse, ILoginRequest } from '../../models/auth';
import { useAppDispatch } from '../../hooks/useApp';
import { setTokens } from '../../store/slices/auth';
import { useState, FormEvent, ChangeEvent } from 'react';

export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ILoginRequest>({
    email: '',
    password: '',
  });
  const [login, { isLoading, error }] = authAPI.useLoginMutation();
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(formData).unwrap()
      .then((payload: IAuthResponse) => {
        dispatch(setTokens(payload));
        navigate('/home');
      })
      .catch(async (error) => {
        console.log(error);
      })
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {error &&
              <label className="block text-base font-medium text-red-500">
                Incorrect login or password
              </label>
            }
            <button
              type="submit"
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ?
                <div className="border-gray-300 mr-2 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
                :
                <>Sign in</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}