import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, LogOut, User as UserIcon, PlayCircle, Bookmark } from 'lucide-react';
import { mockApi } from '../services/api';

interface HeaderProps {
  onViewChange?: (view: 'home' | 'mylearning' | 'enrolled' | 'cart') => void;
  currentView?: string;
  onSearch: (query: string) => void;
  cartCount: number;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView = 'home', onSearch, cartCount, onOpenAuth }) => {
  const [user, setUser] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setUser(mockApi.getCurrentUser());
  }, []);

  useEffect(() => {
    // Keep user in sync with localStorage (simple polling or use an event bus in real apps)
    const interval = setInterval(() => {
      const currentUser = mockApi.getCurrentUser();
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogoClick = () => {
    setSearchInput('');
    onSearch('');
    if (onViewChange) onViewChange('home');
  };

  const handleLogout = () => {
    mockApi.logout();
    setUser(null);
    if (onViewChange) onViewChange('home');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <header className="header glass">
      <div className="container header-container">
        <div className="header-left">
          <div className="logo" onClick={handleLogoClick}>
            DARSHAN ACADEMY
          </div>
        </div>

        <form className="header-center" onSubmit={handleSearchSubmit}>
          <div className="search-bar glass">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Explore engineering & coding..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </form>

        <div className="header-right">
          <button 
            className={`nav-btn ${currentView === 'mylearning' ? 'active' : ''}`}
            onClick={() => {
              if (!user) {
                onOpenAuth('login');
              } else if (onViewChange) {
                onViewChange('mylearning');
              }
            }}
          >
            <PlayCircle size={20} />
            <span>My learning</span>
          </button>
          
          <button 
            className={`nav-btn ${currentView === 'enrolled' ? 'active' : ''}`}
            onClick={() => {
              if (!user) {
                onOpenAuth('login');
              } else if (onViewChange) {
                onViewChange('enrolled');
              }
            }}
          >
            <Bookmark size={20} />
            <span>Enrolled</span>
          </button>

          <div className="cart-wrapper" onClick={() => onViewChange && onViewChange('cart')}>
            <ShoppingCart size={22} className="header-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
          
          <div className="auth-section">
            {user ? (
              <div className="user-profile">
                <div className="user-info hide-mobile">
                  <span className="user-name">Welcome, {user.name}</span>
                </div>
                <div className="profile-icon glass">
                  <UserIcon size={20} />
                </div>
                <button className="btn btn-secondary logout-btn glass" onClick={handleLogout} title="Logout">
                   <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn btn-secondary glass" onClick={() => onOpenAuth('login')}>Log in</button>
                <button className="btn btn-primary" onClick={() => onOpenAuth('signup')}>Sign up</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .header {
          height: var(--header-height);
          position: sticky;
          top: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .logo {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1.5px;
          cursor: pointer;
          color: white;
          white-space: nowrap;
          margin-right: 20px;
        }
        .header-center {
          flex: 1;
          margin: 0 40px;
          max-width: 500px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          border-radius: 12px;
          padding: 0 16px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
        }
        .search-icon {
          color: rgba(255, 255, 255, 0.7);
          margin-right: 12px;
        }
        .search-bar input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          font-size: 15px;
          color: white;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 6px 16px;
          height: 52px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
          color: white;
          opacity: 0.8;
          transition: 0.3s;
          text-transform: uppercase;
        }
        .nav-btn:hover, .nav-btn.active {
          opacity: 1;
          transform: translateY(-2px);
        }
        .cart-wrapper {
          position: relative;
          cursor: pointer;
          padding: 8px;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 8px;
        }
        .cart-wrapper:hover {
          transform: scale(1.1);
        }
        .cart-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: white;
          color: #FF3CAC;
          font-size: 9px;
          font-weight: 900;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .auth-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name {
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .logout-btn {
           width: 42px;
           height: 42px;
           padding: 0;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        @media (max-width: 1024px) {
          .header-center { margin: 0 12px; }
          .nav-btn span { display: none; }
          .nav-btn { width: 44px; padding: 0; }
        }
        @media (max-width: 768px) {
          .logo { font-size: 18px; }
          .header-center { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
