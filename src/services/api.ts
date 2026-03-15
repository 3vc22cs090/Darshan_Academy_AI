/**
 * Mock API Service for Darshan Academy
 * Simulates backend connectivity, persistence, and course enrollment
 */

const USERS_KEY = 'darshan_users';
const CURRENT_USER_KEY = 'darshan_current_user';
const ENROLLMENTS_KEY = 'darshan_enrollments';
const RECENT_KEY = 'darshan_recently_played';
const CART_KEY = 'darshan_cart';

const getStoredUsers = (): any[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

const getStoredEnrollments = (): Record<number, number[]> => {
  const enrollStr = localStorage.getItem(ENROLLMENTS_KEY);
  return enrollStr ? JSON.parse(enrollStr) : {};
};

const getStoredRecentlyPlayed = (userId: number): number[] => {
  const recentStr = localStorage.getItem(`${RECENT_KEY}_${userId}`);
  return recentStr ? JSON.parse(recentStr) : [];
};

const getStoredCart = (userId: number): number[] => {
  const cartStr = localStorage.getItem(`${CART_KEY}_${userId}`);
  return cartStr ? JSON.parse(cartStr) : [];
};

export const mockApi = {
  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          resolve({ success: true, user: userWithoutPassword });
        } else {
          resolve({ success: false, message: 'Invalid email or password. Please sign up first!' });
        }
      }, 1000);
    });
  },

  register: async (name: string, email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getStoredUsers();
        if (users.find(u => u.email === email)) {
          resolve({ success: false, message: 'Email already exists. Please log in.' });
          return;
        }

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

        // Initialize user-specific data
        localStorage.setItem(`${CART_KEY}_${newUser.id}`, JSON.stringify([]));
        localStorage.setItem(`${RECENT_KEY}_${newUser.id}`, JSON.stringify([]));

        resolve({ success: true, user: userWithoutPassword });
      }, 1000);
    });
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  enrollCourse: async (userId: number, courseId: number, password?: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Payment Verification Logic
        if (password) {
          const users = getStoredUsers();
          const user = users.find(u => u.id === userId);
          if (!user || user.password !== password) {
            resolve({ success: false, message: 'Payment Declined: Incorrect password verification.' });
            return;
          }
        }

        const enrollments = getStoredEnrollments();
        if (!enrollments[userId]) {
          enrollments[userId] = [];
        }
        
        if (enrollments[userId].includes(courseId)) {
          resolve({ success: false, message: 'You are already enrolled in this course!' });
          return;
        }

        enrollments[userId].push(courseId);
        localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
        
        // Remove from cart if enrolled
        const cart = getStoredCart(userId);
        const updated = cart.filter(id => id !== courseId);
        localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(updated));
        
        resolve({ success: true, message: 'Payment Successful! Access Granted.' });
      }, 1200);
    });
  },

  getEnrolledCourses: (userId: number): number[] => {
    const enrollments = getStoredEnrollments();
    return enrollments[userId] || [];
  },

  trackRecentlyPlayed: (userId: number, courseId: number) => {
    let recent = getStoredRecentlyPlayed(userId);
    recent = [courseId, ...recent.filter(id => id !== courseId)];
    recent = recent.slice(0, 10);
    localStorage.setItem(`${RECENT_KEY}_${userId}`, JSON.stringify(recent));
  },

  getRecentlyPlayed: (userId: number): number[] => {
    return getStoredRecentlyPlayed(userId);
  },

  addToCart: (userId: number, courseId: number) => {
    const cart = getStoredCart(userId);
    if (!cart.includes(courseId)) {
      cart.push(courseId);
      localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(cart));
    }
  },

  removeFromCart: (userId: number, courseId: number) => {
    const cart = getStoredCart(userId);
    const updated = cart.filter(id => id !== courseId);
    localStorage.setItem(`${CART_KEY}_${userId}`, JSON.stringify(updated));
  },

  getCartItems: (userId: number): number[] => {
    return getStoredCart(userId);
  }
};
