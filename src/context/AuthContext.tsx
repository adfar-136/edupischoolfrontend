import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  userType: 'admin' | 'student' | null;
  loading: boolean;
}

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT' | 'SET_LOADING' | 'VERIFY_SUCCESS';
  payload?: any;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (user: any, userType: 'admin' | 'student') => void;
  logout: () => void;
  verifyToken: () => void;
} | null>(null);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        loading: false
      };
    case 'VERIFY_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        loading: false
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
        loading: false
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    userType: null,
    loading: true
  });

  const login = (user: any, userType: 'admin' | 'student') => {
    dispatch({ type: 'LOGIN', payload: { user, userType } });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('studentData');
    dispatch({ type: 'LOGOUT' });
  };

  const verifyToken = async () => {
    const adminToken = localStorage.getItem('adminToken');
    const studentToken = localStorage.getItem('studentToken');
    const adminData = localStorage.getItem('adminData');
    const studentData = localStorage.getItem('studentData');

    if (adminToken && adminData) {
      try {
        const response = await fetch(API_ENDPOINTS.auth.adminVerify, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'VERIFY_SUCCESS', payload: { user: data.admin, userType: 'admin' } });
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else if (studentToken && studentData) {
      try {
        const user = JSON.parse(studentData);
        dispatch({ type: 'VERIFY_SUCCESS', payload: { user, userType: 'student' } });
      } catch (error) {
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};