import { useEffect } from 'react';
import AddDepartmentForm from './AddDepartmentForm';

export default function DepartmentModal({ editItem, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup">&times;</button>
        <AddDepartmentForm editItem={editItem} onSuccess={onClose} />
      </div>
    </div>
  );
}
