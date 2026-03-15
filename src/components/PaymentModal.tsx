import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  courseTitle: string;
  price: string;
  loading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, courseTitle, price, loading }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Secure Payment</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="payment-summary">
            <p>Confirm purchase for:</p>
            <h3 className="course-name">{courseTitle}</h3>
            <div className="total-price">Total: {price}</div>
          </div>

          <div className="input-group">
            <label>Verify Account Password</label>
            <div className="password-input">
              <Lock size={18} className="lock-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password to pay" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="helper-text">Confirming payment will grant immediate access.</p>
          </div>

          <button className="btn btn-primary pay-btn" type="submit" disabled={loading}>
            {loading ? 'Processing Payment...' : 'Confirm & Buy Now'}
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .payment-modal {
          width: 100%;
          max-width: 440px;
          padding: 32px;
          border-radius: 20px;
          color: white;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.7;
          transition: 0.2s;
        }
        .close-btn:hover {
          opacity: 1;
        }
        .payment-summary {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          text-align: center;
        }
        .course-name {
          margin: 8px 0;
          font-size: 18px;
        }
        .total-price {
          font-size: 24px;
          font-weight: 800;
          margin-top: 8px;
        }
        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .password-input {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          padding: 0 16px;
          height: 52px;
          margin-bottom: 8px;
        }
        .lock-icon {
          opacity: 0.6;
          margin-right: 12px;
        }
        .password-input input {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          font-size: 16px;
        }
        .helper-text {
          font-size: 11px;
          opacity: 0.6;
          margin-bottom: 24px;
        }
        .pay-btn {
          width: 100%;
          height: 56px !important;
          font-size: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
