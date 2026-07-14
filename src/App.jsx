import useAuth from './hooks/useAuth';
import DepartmentPage from './pages/Department';
import RolePage from './pages/Role';
import VehiclePage from './pages/Vehicle';
import UserPage from './pages/User';
import './App.css';

export default function App() {
  const { ready, authError } = useAuth();

  if (authError) {
    return <div className="app"><p className="error-msg">{authError}</p></div>;
  }

  if (!ready) {
    return <div className="app"><p className="status-msg">Menghubungkan ke server...</p></div>;
  }

  return (
    <div className="app">
      <DepartmentPage />
      <hr className="page-divider" />
      <RolePage />
      <hr className="page-divider" />
      <VehiclePage />
      <hr className="page-divider" />
      <UserPage />
    </div>
  );
}
