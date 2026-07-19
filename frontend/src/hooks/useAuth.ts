import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { login as authServiceLogin, register as authServiceRegister } from '@/services/authService';
import { AuthRequest, AuthResponse } from '@/types/auth';
import { RegisterRequest } from '@/types/register';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, token, isAuthenticated, loading, login, logout } = context;

  const loginUser = async (credentials: AuthRequest) => {
    const response: AuthResponse = await authServiceLogin(credentials);
    if (response.token && response.username && response.roles) {
      login(response.token, response.username, response.roles);
    } else {
      throw new Error('Login failed: Invalid response from server');
    }
  };

  const registerUser = async (userData: RegisterRequest) => {
    const response: AuthResponse = await authServiceRegister(userData);
    if (response.token && response.username && response.roles) {
      login(response.token, response.username, response.roles);
    } else {
      throw new Error('Registration failed: Invalid response from server');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    loginUser,
    registerUser,
  };
};

export default useAuth;