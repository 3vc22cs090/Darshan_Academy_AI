import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import { mockApi } from './services/api';

const ALL_COURSES = [
  // --- Programming Fundamentals ---
  { id: 1, image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80', title: 'C Programming for Beginners: Master the C Language', instructor: 'Dr. John Smith', rating: 4.7, reviews: '12,402', price: '$12.99', originalPrice: '$84.99', badge: 'Bestseller', videoUrl: 'https://www.youtube.com/watch?v=KJgsSFPNupA', tags: ['c', 'programming', 'basics'] },
  { id: 2, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', title: 'C++ Tutorial for Beginners: Full Course', instructor: 'FreeCodeCamp', rating: 4.8, reviews: '89,541', price: '$14.99', originalPrice: '$89.99', badge: 'Top Rated', videoUrl: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y', tags: ['c++', 'cpp', 'programming'] },
  { id: 3, image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80', title: 'Java Programming Masterclass', instructor: 'Tim Buchalka', rating: 4.9, reviews: '158,210', price: '$11.99', originalPrice: '$79.99', videoUrl: 'https://www.youtube.com/watch?v=GoXwIVyNvX0', tags: ['java', 'backend'] },
  { id: 4, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', title: 'Complete Python Bootcamp: Zero to Hero', instructor: 'Jose Portilla', rating: 4.8, reviews: '452,102', price: '$13.99', originalPrice: '$84.99', videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', tags: ['python', 'coding'] },
  
  // --- Web Development (Frontend) ---
  { id: 5, image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', title: 'HTML & CSS Full Course - Beginner to Pro', instructor: 'SuperSimpleDev', rating: 4.7, reviews: '67,000', price: '$9.99', originalPrice: '$49.99', videoUrl: 'https://www.youtube.com/watch?v=G3e-cpL7ofc', tags: ['html', 'css', 'frontend'] },
  { id: 6, image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80', title: 'JavaScript Mastery: The Complete Guide', instructor: 'Jonas Schmedtmann', rating: 4.9, reviews: '230,000', price: '$14.99', originalPrice: '$94.99', videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', tags: ['javascript', 'js', 'frontend'] },
  { id: 25, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', title: 'React JS Full Course 2026', instructor: 'Dave Gray', rating: 4.8, reviews: '45,000', price: '$12.99', originalPrice: '$74.99', videoUrl: 'https://www.youtube.com/watch?v=u6gSSpfRw2U', tags: ['react', 'frontend', 'web development'] },

  // --- Web Development (Backend & Fullstack) ---
  { id: 8, image: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80', title: 'Node.js, Express, MongoDB & More', instructor: 'Maximilian', rating: 4.7, reviews: '112,000', price: '$13.99', originalPrice: '$89.99', videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', tags: ['backend', 'node', 'mongodb'] },
  { id: 9, image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80', title: 'Full Stack Web Development Bootcamp', instructor: 'Angela Yu', rating: 4.9, reviews: '340,000', price: '$14.99', originalPrice: '$99.99', badge: 'Academy Pick', videoUrl: 'https://www.youtube.com/watch?v=Q8NPGAZ_d8c', tags: ['web development', 'fullstack'] },

  // --- Data & AI ---
  { id: 7, image: 'https://images.unsplash.com/photo-1544383335-c63503b07043?w=800&q=80', title: 'SQL & MySQL: Master Databases', instructor: 'Colt Steele', rating: 4.6, reviews: '56,102', price: '$11.99', originalPrice: '$69.99', videoUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', tags: ['sql', 'mysql', 'database'] },
  { id: 18, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', title: 'AI & Machine Learning for Beginners', instructor: 'Andrew Ng', rating: 4.9, reviews: '180,000', price: '$15.99', originalPrice: '$129.99', videoUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', tags: ['ai', 'ml', 'machine learning', 'aiml'] },
  { id: 19, image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80', title: 'Deep Learning Specialization', instructor: 'DeepLearning.AI', rating: 4.8, reviews: '45,000', price: '$16.99', originalPrice: '$149.99', badge: 'Advanced', videoUrl: 'https://www.youtube.com/watch?v=6M5VXAPf6kU', tags: ['dl', 'deep learning', 'ai'] },

  // --- Engineering Specific ---
  { id: 10, image: 'https://images.unsplash.com/photo-1581094794329-c8112a4e5190?w=800&q=80', title: 'Computer Architecture & Organization', instructor: 'Dr. Sarah J', rating: 4.7, reviews: '12,400', price: '$15.99', originalPrice: '$99.99', videoUrl: 'https://www.youtube.com/watch?v=4Tz59En2z6M', tags: ['engineering', 'computer'] },
  { id: 12, image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80', title: 'Thermodynamics: Energy Foundation', instructor: 'Prof. Miller', rating: 4.6, reviews: '8,500', price: '$11.99', originalPrice: '$64.99', videoUrl: 'https://www.youtube.com/watch?v=9GMBpZZtjXM', tags: ['engineering', 'mechanical'] },
  { id: 13, image: 'https://images.unsplash.com/photo-1503387762-592be5854ef2?w=800&q=80', title: 'Civil Engineering: Structural Analysis', instructor: 'Eng. David R', rating: 4.5, reviews: '5,200', price: '$14.99', originalPrice: '$89.99', videoUrl: 'https://www.youtube.com/watch?v=XIdC99C6Ams', tags: ['engineering', 'civil'] },
  { id: 15, image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&q=80', title: 'Digital Electronics & Logic Design', instructor: 'Morris Mano', rating: 4.8, reviews: '22,400', price: '$10.99', originalPrice: '$59.99', videoUrl: 'https://www.youtube.com/watch?v=mDRE_84o1lA', tags: ['engineering', 'electronics'] },

  // --- Expansion Pack ---
  { id: 30, image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?w=800&q=80', title: 'C++ Data Structures and Algorithms', instructor: 'Abdul Bari', rating: 4.9, reviews: '45,200', price: '$14.99', originalPrice: '$89.99', videoUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME', tags: ['c++', 'cpp', 'dsa'] },
  { id: 31, image: 'https://images.unsplash.com/photo-1512756290469-6d335acd49bc?w=800&q=80', title: 'Mastering Java Spring Boot 3', instructor: 'Chad Darby', rating: 4.8, reviews: '12,000', price: '$13.99', originalPrice: '$79.99', videoUrl: 'https://www.youtube.com/watch?v=vtPkZShrpr0', tags: ['java', 'spring', 'backend'] },
  { id: 32, image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', title: 'Frontend Developer Roadmap 2026', instructor: 'Traversy Media', rating: 4.8, reviews: '100,000', price: '$0.00', originalPrice: 'FREE', badge: 'Free', videoUrl: 'https://www.youtube.com/watch?v=TzZ3vO8e8C8', tags: ['frontend', 'web development'] },
  { id: 33, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', title: 'Backend Engineering: The Ultimate Guide', instructor: 'Hussein Nasser', rating: 4.9, reviews: '34,000', price: '$15.99', originalPrice: '$119.99', videoUrl: 'https://www.youtube.com/watch?v=XIdC99C6Ams', tags: ['backend', 'engineering'] },
  { id: 34, image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', title: 'Machine Learning with Python', instructor: 'Edureka', rating: 4.7, reviews: '88,000', price: '$12.99', originalPrice: '$74.99', videoUrl: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', tags: ['ml', 'python', 'ai'] }
];

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'mylearning' | 'enrolled' | 'cart'>('home');
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lifted Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);

  // Lifted Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCourse, setPaymentCourse] = useState<{id: number, title: string, price: string} | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    setUser(mockApi.getCurrentUser());
    refreshData();
  }, [view]);

  const refreshData = () => {
    const currentUser = mockApi.getCurrentUser();
    if (currentUser) {
      setEnrolledIds(mockApi.getEnrolledCourses(currentUser.id));
      setRecentIds(mockApi.getRecentlyPlayed(currentUser.id));
      setCartIds(mockApi.getCartItems(currentUser.id));
    } else {
      setEnrolledIds([]);
      setRecentIds([]);
      setCartIds([]);
    }
  };

  const handleActionRefresh = () => {
    refreshData();
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    refreshData();
    setIsAuthModalOpen(false);
  };

  const handleOpenPayment = (id: number, title: string, price: string) => {
    const currentUser = mockApi.getCurrentUser();
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setPaymentCourse({ id, title, price });
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (password: string) => {
    if (!paymentCourse || !user) return;
    
    setPaymentLoading(true);
    const result = await mockApi.enrollCourse(user.id, paymentCourse.id, password);
    
    if (result.success) {
      // Show success on the button for a brief moment before alert
      setTimeout(() => {
        setPaymentLoading(false);
        alert('🎉 ' + result.message);
        setIsPaymentModalOpen(false);
        refreshData();
      }, 800);
    } else {
      setPaymentLoading(false);
      alert('❌ ' + result.message);
    }
  };

  const filteredCourses = ALL_COURSES.filter(course => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return course.title.toLowerCase().includes(query) || 
           course.instructor.toLowerCase().includes(query) ||
           course.tags.some(t => t.toLowerCase().includes(query));
  });

  const enrolledCourses = ALL_COURSES.filter(c => enrolledIds.includes(c.id));
  const recentCourses = ALL_COURSES.filter(c => recentIds.includes(c.id));
  const cartCourses = ALL_COURSES.filter(c => cartIds.includes(c.id));

  return (
    <div className="app">
      <Header 
        onViewChange={setView} 
        currentView={view} 
        onSearch={setSearchQuery} 
        cartCount={cartIds.length} 
        onOpenAuth={handleOpenAuth} 
      />
      
      <main>
        {view === 'home' ? (
          <>
            {!searchQuery && <Hero />}
            <div className="container view-container" id="course-list">
              <div className="catalog-insights">
                <div className="stats-bar glass">
                  <div className="stats-item">
                    <span className="stats-icon">✨</span>
                    <span className="stats-text">{filteredCourses.length} Available Courses</span>
                  </div>
                </div>
              </div>
              <section className="course-section">
                <h2 className="section-title">
                   {searchQuery ? `Courses for "${searchQuery}"` : 'Academy Hub: Master Your Future'}
                </h2>
                <div className="course-grid">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      {...course} 
                      isEnrolled={enrolledIds.includes(course.id)}
                      isInCart={cartIds.includes(course.id)}
                      onEnrollClick={handleOpenPayment}
                      onCartChange={handleActionRefresh}
                      onVideoClick={handleActionRefresh}
                    />
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="empty-state glass">
                      <p>No matches found. Try searching for "ML", "Web", or "C++".</p>
                      <button className="btn btn-primary" onClick={() => setSearchQuery('')} style={{marginTop: '16px'}}>Clear Search</button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : view === 'cart' ? (
          <div className="container view-container">
            <h1 className="section-title">Your Shopping Cart</h1>
            {cartCourses.length > 0 ? (
               <div className="course-grid">
                 {cartCourses.map((course) => (
                   <CourseCard 
                    key={course.id} 
                    {...course} 
                    isEnrolled={false}
                    isInCart={true}
                    onEnrollClick={handleOpenPayment}
                    onCartChange={handleActionRefresh}
                   />
                 ))}
               </div>
            ) : (
              <div className="empty-state glass">
                 <p>Your cart is empty.</p>
                 <button className="btn btn-primary" onClick={() => setView('home')} style={{marginTop: '20px'}}>Keep Shopping</button>
              </div>
            )}
          </div>
        ) : view === 'enrolled' ? (
          <div className="container view-container">
            <h1 className="section-title">Your Learning Library</h1>
            <div className="course-grid">
              {enrolledCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  {...course} 
                  isEnrolled={true} 
                  onVideoClick={handleActionRefresh} 
                />
              ))}
              {enrolledCourses.length === 0 && (
                <div className="empty-state glass">
                  <p>Invest in your future. Enroll in your first course!</p>
                  <button className="btn btn-primary" onClick={() => setView('home')} style={{marginTop: '20px'}}>Browse All</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="container view-container">
            <h1 className="section-title">Watch History</h1>
            <div className="course-grid">
              {recentCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  {...course} 
                  isEnrolled={enrolledIds.includes(course.id)} 
                  onEnrollClick={handleOpenPayment}
                  onVideoClick={handleActionRefresh} 
                />
              ))}
              {recentCourses.length === 0 && (
                <div className="empty-state glass">
                  <p>Your recently watched videos will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
        courseTitle={paymentCourse?.title || ''}
        price={paymentCourse?.price || ''}
        loading={paymentLoading}
      />
      
      <style>{`
        .view-container {
          padding-top: 20px;
          padding-bottom: 80px;
          min-height: 70vh;
        }
        .catalog-insights {
          margin-bottom: 32px;
          display: flex;
          justify-content: flex-start;
        }
        .stats-bar {
          display: flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        .stats-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stats-icon {
          font-size: 18px;
        }
        .stats-text {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.9);
        }
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
        }
        .empty-state {
          padding: 80px 24px;
          text-align: center;
          grid-column: 1 / -1;
        }
        .section-title {
          font-size: 28px;
          margin-bottom: 24px;
          font-weight: 900;
        }
        @media (max-width: 600px) {
           .course-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default App;
