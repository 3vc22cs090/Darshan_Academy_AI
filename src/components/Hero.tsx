import React from 'react';

const Hero: React.FC = () => {
  const scrollToCourses = () => {
    const element = document.getElementById('course-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero glass-hero">
      <div className="container hero-container">
        <div className="hero-content glass card-overlay">
          <h1>Master the Future<br/>with Darshan Academy</h1>
          <p>
            Join thousands of students learning cutting-edge engineering, 
            coding, and AI skills from industry-leading instructors worldwide.
          </p>
          <button className="btn btn-purple hero-btn" onClick={scrollToCourses}>
            Explore All Courses
          </button>
        </div>
      </div>
      <style>{`
        .hero {
          height: 600px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 0 32px;
          border-radius: 24px;
          overflow: hidden;
          background: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070') center/cover no-repeat;
        }
        .hero-container {
          width: 100%;
          padding-left: 60px;
        }
        .card-overlay {
          max-width: 580px;
          padding: 50px;
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        .hero-content h1 {
          font-size: 56px;
          line-height: 1.1;
          margin-bottom: 24px;
          font-weight: 900;
        }
        .hero-content p {
          font-size: 18px;
          margin-bottom: 32px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }
        .hero-btn {
          height: 56px !important;
          padding: 0 40px !important;
          font-size: 16px !important;
        }
        @media (max-width: 768px) {
          .hero-container { padding: 40px; }
          .hero-content h1 { font-size: 42px; }
          .card-overlay { padding: 30px; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
