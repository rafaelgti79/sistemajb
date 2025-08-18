import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogado");
    if (userData) {
      setLogin(JSON.parse(userData));
    }
  }, []);

  const usuario = (user) => {
    setLogin(user);
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
  };

  const logout = () => {
    setLogin(null);
    localStorage.removeItem("usuarioLogado");
  };

  return (
    <AuthContext.Provider value={{ login, usuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

 export const useAuth = () => useContext(AuthContext);

/*import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // sem carregar do localStorage
  const [token, setToken] = useState("");       // sem carregar do localStorage

  const login = (usuarioLogado) => {
    setUsuario(usuarioLogado);
    if (usuarioLogado.token) {
      setToken(usuarioLogado.token);
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; */
