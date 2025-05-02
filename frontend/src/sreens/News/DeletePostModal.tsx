import { MouseEventHandler } from 'react';

type Props = {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export default function DeletePostModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h2>Удалить пост?</h2>
        <p>Это действие нельзя отменить</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}