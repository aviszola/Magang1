import Modal from '../../common/Modal';
import AddDepartmentForm from './AddDepartmentForm';

export default function DepartmentModal({ open, editItem, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <AddDepartmentForm editItem={editItem} onSuccess={onClose} />
    </Modal>
  );
}
