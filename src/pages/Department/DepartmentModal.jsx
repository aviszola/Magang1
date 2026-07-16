import Modal from '../../common/Modal';
import DepartmentForm from './DepartmentForm';

export default function DepartmentModal({ open, editItem, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <DepartmentForm editItem={editItem} onSuccess={onClose} />
    </Modal>
  );
}
