import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const login = (userData: any) => {
    console.log("Вход выполнен для:", userData.email);
    setUser(userData);
  };

  const logout = () => {
    console.log("Выход из аккаунта...");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);