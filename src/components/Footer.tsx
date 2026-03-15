import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-links">
            <div className="footer-column">
              <a href="#">Darshan Business</a>
              <a href="#">Teach on Darshan</a>
              <a href="#">Get the app</a>
              <a href="#">About us</a>
              <a href="#">Contact us</a>
            </div>
            <div className="footer-column">
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Help and Support</a>
              <a href="#">Affiliate</a>
              <a href="#">Investors</a>
            </div>
            <div className="footer-column">
              <a href="#">Terms</a>
              <a href="#">Privacy policy</a>
              <a href="#">Cookie settings</a>
              <a href="#">Sitemap</a>
              <a href="#">Accessibility statement</a>
            </div>
          </div>
          <div className="footer-language">
             <button className="btn btn-secondary language-btn" style={{borderColor: 'white', color: 'white'}}>
                English
             </button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">DARSHAN LMS</div>
          <div className="copyright">© 2026 Darshan LMS, Inc.</div>
        </div>
      </div>
      <style>{`
        .footer {
          background-color: var(--text-main);
          color: var(--bg-white);
          padding: 24px 0;
          margin-top: 64px;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #3e4143;
          padding-bottom: 32px;
          margin-bottom: 32px;
        }
        .footer-links {
          display: flex;
          gap: 120px;
        }
        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-column a {
          font-size: 14px;
          color: var(--bg-white);
        }
        .footer-column a:hover {
          text-decoration: underline;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-logo {
          font-size: 24px;
          font-weight: 700;
        }
        .copyright {
          font-size: 12px;
        }
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            gap: 24px;
          }
          .footer-links {
            flex-direction: column;
            gap: 24px;
          }
          .footer-language {
            align-self: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
