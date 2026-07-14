import Modal from '../../common/Modal';
import AddVehicleForm from './AddVehicleForm';

export default function VehicleModal({ open, editItem, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <AddVehicleForm editItem={editItem} onSuccess={onClose} />
    </Modal>
  );
}
