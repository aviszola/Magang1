import Modal from '../../common/Modal';
import AddRoleForm from './AddRoleForm';

export default function RoleModal({ open, editItem, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <AddRoleForm editItem={editItem} onSuccess={onClose} />
    </Modal>
  );
}
