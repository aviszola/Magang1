import { useEffect, useState } from 'react';
import { login } from './api/auth';
import DepartmentList from './components/DepartmentList';
import DepartmentModal from './components/DepartmentModal';
import './App.css';

export default function App() {
  const [ready, setReady] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setReady(true);
      return;
    }
    login('magang@mail.com', 'magang')
      .then(() => setReady(true))
      .catch((err) => setAuthError('Gagal login: ' + (err.response?.data?.message ?? err.message)));
  }, []);

  function openAdd() {
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(dept) {
    setEditItem(dept);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditItem(null);
  }

  if (authError) {
    return <div className="app"><p className="error-msg">{authError}</p></div>;
  }

  if (!ready) {
    return <div className="app"><p className="status-msg">Menghubungkan ke server...</p></div>;
  }

  return (
    <div className="app">
      <header>
        <h1>Manajemen Department</h1>
      </header>
      <main>
        <DepartmentList onAdd={openAdd} onEdit={openEdit} />
        {showModal && (
          <DepartmentModal editItem={editItem} onClose={closeModal} />
        )}
      </main>
    </div>
  );
}
