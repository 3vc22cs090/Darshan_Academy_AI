import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { mockApi } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    let result: any;
    if (mode === 'login') {
      result = await mockApi.login(email, password);
    } else {
      result = await mockApi.register(name, email, password);
    }

    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass auth-card">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Join Darshan Academy'}</h2>
          <p className="modal-subtitle">
            {mode === 'login' ? 'Log in to continue your journey' : 'Create an account to start learning'}
          </p>
        </div>

        {error && (
          <div className="error-banner glass">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="input-group glass">
              <User size={20} className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          
          <div className="input-group glass">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group glass">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-purple auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'login' ? 'Log in' : 'Sign Up')}
          </button>
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p>Don't have an account? <button className="toggle-mode" onClick={() => { setMode('signup'); setError(null); }}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button className="toggle-mode" onClick={() => { setMode('login'); setError(null); }}>Log in</button></p>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.7);
          display: flex;
          align-items: center; /* Vertical center */
          justify-content: center; /* Horizontal center */
          z-index: 2000;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
          padding: 40px 20px;
          overflow-y: auto;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .auth-card {
          margin: auto; /* Crucial for centering when using overflow-y: auto on parent */
          padding: 60px 40px;
          width: 100%;
          max-width: 440px;
          position: relative;
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .modal-header h2 {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 8px;
          color: white;
        }
        .modal-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
        }
        .error-banner {
          background: rgba(255, 0, 0, 0.2);
          border-color: rgba(255, 0, 0, 0.3);
          color: #ff8080;
          padding: 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
        }
        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          color: rgba(255, 255, 255, 0.5);
          background: none;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }
        .close-btn:hover {
          color: white;
          transform: rotate(90deg);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          color: rgba(255, 255, 255, 0.5);
        }
        .input-group input {
          width: 100%;
          height: 52px;
          padding: 0 16px 0 52px;
          border: none;
          background: none;
          outline: none;
          font-size: 16px;
          color: white;
        }
        .auth-submit {
          height: 56px !important;
          font-size: 16px !important;
          margin-top: 12px;
          box-shadow: 0 10px 25px rgba(255, 60, 172, 0.3);
        }
        .modal-footer {
          margin-top: 32px;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
        }
        .toggle-mode {
          color: #FF3CAC;
          font-weight: 800;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: none;
          transition: 0.3s;
        }
        .toggle-mode:hover {
          color: #ff60c0;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
