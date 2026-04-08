import { createContext, useContext, useReducer, useEffect } from 'react';
import { getMe } from '../api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('fixify_user') || 'null'),
  token: localStorage.getItem('fixify_token') || null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('fixify_token', action.payload.token);
      localStorage.setItem('fixify_user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('fixify_token');
      localStorage.removeItem('fixify_user');
      return { user: null, token: null, loading: false };
    case 'SET_USER':
      localStorage.setItem('fixify_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const { data } = await getMe();
          dispatch({ type: 'SET_USER', payload: data });
        } catch {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    loadUser();
  }, []);

  const login = (data) => dispatch({ type: 'LOGIN', payload: data });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const updateUser = (user) => dispatch({ type: 'SET_USER', payload: user });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
