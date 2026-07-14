import { useState } from 'react';
import VehicleList from './VehicleList';
import VehicleModal from './VehicleModal';

export default function VehiclePage() {
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  function openAdd() {
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(vehicle) {
    setEditItem(vehicle);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditItem(null);
  }

  return (
    <>
      <header>
        <h1>Manajemen Vehicle</h1>
      </header>
      <main>
        <VehicleList
          search={search}
          onSearchChange={setSearch}
          onAdd={openAdd}
          onEdit={openEdit}
        />
        <VehicleModal open={showModal} editItem={editItem} onClose={closeModal} />
      </main>
    </>
  );
}
