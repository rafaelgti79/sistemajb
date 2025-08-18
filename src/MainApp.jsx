import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/login";
import App from "./App"; 
import { useAuth } from "./context/AuthContext";

function MainApp() {
  const { usuario } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protege rota principal */}
        <Route
          path="/app/*"
          element={usuario ? <App /> : <Navigate to="/login" />}
        />

        {/* Redireciona tudo para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
