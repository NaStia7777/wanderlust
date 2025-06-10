import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { MainPage } from './pages/MainPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PlanRoutePage } from './pages/PlanRoutePage';
import { ExplorePage } from './pages/ExplorePage';
import RoutePage from './pages/RoutePage';
import AddRoutePage from './pages/AddRoutePage';
import { useAppSelector } from './hooks/useApp';
function App() {

  const { role } = useAppSelector(state => state.authReducer);
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {role === 'user' && <>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/plan-route" element={<PlanRoutePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/route/:id" element={<RoutePage />} />
          </>
          }
          {role==='agency' && <>
            <Route path="/add-route" element={<AddRoutePage />} />
            <Route path="/route/:id" element={<RoutePage />} />
            <Route path="/home" element={<HomePage />} />
          </>}

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;