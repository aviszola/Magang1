import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel, isPending }) {
  return (
    <Modal open={true} onClose={onCancel}>
      <div className="confirm-dialog-inner">
        <p className="confirm-msg">{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel} disabled={isPending}>
            Batal
          </button>
          <button className="btn-delete-confirm" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
