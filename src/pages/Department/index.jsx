import { useState } from 'react';
import DepartmentList from './DepartmentList';
import DepartmentModal from './DepartmentModal';

export default function DepartmentPage() {
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

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

  return (
    <>
      <header>
        <h1>Manajemen Department</h1>
      </header>
      <main>
        <DepartmentList
          search={search}
          onSearchChange={setSearch}
          onAdd={openAdd}
          onEdit={openEdit}
        />
        <DepartmentModal open={showModal} editItem={editItem} onClose={closeModal} />
      </main>
    </>
  );
}
