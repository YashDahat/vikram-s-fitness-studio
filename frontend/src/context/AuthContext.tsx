import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '@/types/auth';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, username: string, roles: string[]) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // In a real application, you would validate the token with the backend.
          // For this feature, we assume a stored token implies authentication.
          // Decode token to get user info (username, roles)
          // This is a simplified approach. A more robust solution would involve
          // sending the token to the backend to get user details or using a library
          // to decode JWTs if they are client-side decodable.
          // For now, we'll just set a placeholder user if a token exists.
          // In a real app, you'd likely fetch user details from an /me endpoint.

          // Placeholder for decoding token to get username and roles
          // This part needs to be implemented based on your JWT structure.
          // For example, if your JWT is base64 encoded and contains user info:
          // const decoded = JSON.parse(atob(storedToken.split('.')[1]));
          // const username = decoded.username;
          // const roles = decoded.roles;

          // For this exercise, we'll assume the login function will provide these
          // and we'll only store the token here.
          // If the token is present, we set isAuthenticated to true and loading to false.
          // The actual user object will be populated upon a successful login call.

          // To simulate user data from a token, we could parse it if it's a JWT
          // and contains claims like username and roles.
          // For simplicity, we'll assume the login function is the primary way to set user data.
          // If a token exists on refresh, we'll mark as authenticated but user details might be null
          // until a subsequent login or a dedicated /me endpoint call.
          setIsAuthenticated(true);
          setToken(storedToken);
          // If you need user details on refresh, you'd make an API call here
          // e.g., authService.getUserProfile(storedToken).then(data => setUser(data));
        } catch (error) {
          console.error("Failed to process stored token:", error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, username: string, roles: string[]) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser({ username, roles });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};