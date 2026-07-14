import Modal from '../../common/Modal';
import UserForm from './UserForm';

export default function UserModal({ open, editItem, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <UserForm editItem={editItem} onSuccess={onClose} />
    </Modal>
  );
}
