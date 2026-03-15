import React from 'react';
import { Star, PlayCircle, Lock, ShoppingCart } from 'lucide-react';
import { mockApi } from '../services/api';

interface CourseCardProps {
  id: number;
  image: string;
  title: string;
  instructor: string;
  rating: number;
  reviews: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  videoUrl: string;
  isEnrolled?: boolean;
  isInCart?: boolean;
  onEnrollClick?: (id: number, title: string, price: string) => void;
  onCartChange?: () => void;
  onVideoClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  id, image, title, instructor, rating, reviews, price, originalPrice, badge, videoUrl, isEnrolled, isInCart, onEnrollClick, onCartChange, onVideoClick 
}) => {
  const handleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEnrolled) {
      alert('🔒 Access Denied: Enroll in this course to start watching!');
      return;
    }
    const user = mockApi.getCurrentUser();
    if (user) {
      mockApi.trackRecentlyPlayed(user.id, id);
    }
    window.open(videoUrl, '_blank');
    if (onVideoClick) onVideoClick();
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnrollClick) {
      onEnrollClick(id, title, price);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = mockApi.getCurrentUser();
    if (!user) {
      alert('Please log in to add items to your cart!');
      return;
    }
    mockApi.addToCart(user.id, id);
    if (onCartChange) onCartChange();
    alert(`🛒 Added "${title}" to your cart!`);
  };

  return (
    <div className={`course-card glass ${!isEnrolled ? 'locked' : ''}`} onClick={handleVideoPlay}>
      <div className="course-image">
        <img src={image} alt={title} />
        <div className="play-overlay">
          {isEnrolled ? (
            <PlayCircle size={48} color="white" strokeWidth={1} />
          ) : (
            <div className="locked-overlay">
              <Lock size={32} color="white" />
              <p>Enroll to Unlock</p>
            </div>
          )}
        </div>
      </div>
      <div className="course-info">
        <h3 className="course-title">{title}</h3>
        <p className="course-instructor">{instructor}</p>
        <div className="course-rating">
          <span className="rating-number">{rating.toFixed(1)}</span>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(rating) ? "#FFD700" : "none"} 
                color="#FFD700" 
              />
            ))}
          </div>
          <span className="review-count">({reviews})</span>
        </div>
        
        <div className="course-price-row">
          <div className="course-price">
            <span className="current-price">{price}</span>
            {originalPrice && <span className="original-price">{originalPrice}</span>}
          </div>
          {!isEnrolled ? (
            <div className="card-actions">
               {!isInCart && (
                 <button className="icon-btn" onClick={handleAddToCart} title="Add to Cart">
                   <ShoppingCart size={18} />
                 </button>
               )}
               <button 
                className="btn btn-primary buy-btn" 
                onClick={handleEnrollClick}
              >
                Enroll
              </button>
            </div>
          ) : (
            <div className="enrolled-tag-white">Enrolled</div>
          )}
        </div>
        {badge && <div className="course-badge">{badge}</div>}
      </div>

      <style>{`
        .course-card {
          width: 100%;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
          padding: 16px;
        }
        .course-card:hover {
          transform: translateY(-12px) scale(1.02);
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
        }
        .course-image {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s;
        }
        .locked .course-image img {
          filter: grayscale(0.5) blur(1px);
        }
        .course-card:hover .course-image img {
          transform: scale(1.1);
        }
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: 0.3s;
        }
        .course-card:hover .play-overlay {
          opacity: 1;
        }
        .locked-overlay {
           text-align: center;
        }
        .course-title {
          font-size: 16px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 8px;
          height: 42px;
          overflow: hidden;
        }
        .course-instructor {
          font-size: 13px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .course-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .course-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
        }
        .card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }
        .icon-btn:hover {
          background: white;
          color: #784BA0;
        }
        .current-price {
          font-size: 18px;
          font-weight: 800;
        }
        .buy-btn {
           height: 36px !important;
           padding: 0 16px !important;
           font-size: 13px !important;
        }
      `}</style>
    </div>
  );
};

export default CourseCard;
