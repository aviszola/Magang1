import useAuth from './hooks/useAuth';
import DepartmentPage from './pages/Department';
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
    </div>
  );
}
