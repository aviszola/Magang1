import { useState } from 'react';
import UserList from './UserList';
import UserModal from './UserModal';

export default function UserPage() {
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  function openAdd() {
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(user) {
    setEditItem(user);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditItem(null);
  }

  return (
    <>
      <header>
        <h1>Manajemen User</h1>
      </header>
      <main>
        <UserList
          search={search}
          onSearchChange={setSearch}
          onAdd={openAdd}
          onEdit={openEdit}
        />
        <UserModal open={showModal} editItem={editItem} onClose={closeModal} />
      </main>
    </>
  );
}
