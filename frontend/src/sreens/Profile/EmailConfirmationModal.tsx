import { FiX } from 'react-icons/fi';
import './EmailConfirmationModal.scss';

interface EmailConfirmationModalProps {
  email: string;
  onClose: () => void;
}

export default function EmailConfirmationModal({ email, onClose }: EmailConfirmationModalProps) {
  return (
    <div className="email-confirm-modal">
      <div className="email-confirm-content">
        <div className="email-confirm-header">
          <h2>Подтверждение почты</h2>
          <button className="close-btn" onClick={onClose} type="button">
            <FiX />
          </button>
        </div>
        <p className="email-confirm-text">
          На {email} отправлено письмо с подтверждением.\nВведите код из письма, чтобы подтвердить почту.
        </p>
        <button className="confirm-close-btn" onClick={onClose} type="button">
          Закрыть
        </button>
      </div>
    </div>
  );
}
