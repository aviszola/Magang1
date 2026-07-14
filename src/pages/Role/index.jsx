import { useState } from 'react';
import RoleList from './RoleList';
import RoleModal from './RoleModal';

export default function RolePage() {
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  function openAdd() {
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(role) {
    setEditItem(role);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditItem(null);
  }

  return (
    <>
      <header>
        <h1>Manajemen Role</h1>
      </header>
      <main>
        <RoleList
          search={search}
          onSearchChange={setSearch}
          onAdd={openAdd}
          onEdit={openEdit}
        />
        <RoleModal open={showModal} editItem={editItem} onClose={closeModal} />
      </main>
    </>
  );
}
