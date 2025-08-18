import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../constants/api.js';
import './login.css';

function Login() {
  const [area, setArea] = useState('penha');
  const [login, setLogin] = useState(''); // trocar para login
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { usuario } = useAuth();


  const handleLogin = async (e) => {
  e.preventDefault();

  const payload = { login, senha, area };
  console.log("Enviando para o servidor:", payload);

  try {
    const response = await api.post('/login.php', payload);
    console.log("Resposta do servidor:", response.data);

    const usuarioLogado = response.data;

    // Só permite login se o id for maior que 0
    if (usuarioLogado && usuarioLogado.id > 0) {
      usuario(usuarioLogado); // atualiza o contexto, incluindo token se existir
      navigate('/app'); // redireciona para o app
    } else {
      alert('Usuário ou senha inválidos');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert(error.response?.data?.error || 'Erro ao conectar com o servidor');
  }
};

  /* const handleLogin = async (e) => {
  e.preventDefault();

  const payload = { login, senha, area };
  console.log("Enviando para o servidor:", payload);

  try {
    const response = await api.post('/login.php', payload);
    console.log("Resposta do servidor:", response.data);

    const usuarioLogado = response.data;

    // Só permite login se o id for maior que 0
    if (usuarioLogado && usuarioLogado.id > 0) {
      usuario(usuarioLogado); // atualiza o contexto
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      
      // Salvar token separadamente se precisar para requisições futuras
      if (usuarioLogado.token) {
        localStorage.setItem('token', usuarioLogado.token);
      }

      navigate('/app'); // redireciona para o app
    } else {
      alert('Usuário ou senha inválidos');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    alert(error.response?.data?.error || 'Erro ao conectar com o servidor');
  }
}; */


  /* const handleLogin = async (e) => {
  e.preventDefault();

  // usuário e senha fictícios para teste
  const usuarioFicticio = "admin";
  const senhaFicticia = "1234";

  if (usuario === usuarioFicticio && senha === senhaFicticia) {
    const usuarioLogado = { nome: usuarioFicticio };

    login(usuarioLogado); // contexto
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    navigate("/app/home");
  } else {
    alert("Usuário ou senha inválidos (use admin / 1234)");
  }
}; */


  /* const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { login, senha, area };
  console.log("Enviando para o servidor:", payload); // <-- aqui

    try {
      const response = await api.post('/login.php', { login, senha, area });
       console.log("Resposta do servidor:", response.data); // <-- aqui

      const usuarioLogado = response.data.contas;

      if (usuarioLogado) {
        usuario(usuarioLogado); // contexto
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        navigate('/app');
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert(error.response?.data?.error || 'Erro ao conectar com o servidor');
    }
  };  */

  return (
    <div className='containerLogi'>
      <form >
      <h2>Login</h2>

      <div>
      <input className='input-box' type="email" placeholder="Nome" onChange={(e) => setLogin(e.target.value)} />
      {/* //<FaUser className='icon' /> */}
      </div>

      <div>
      <input className='input-box' type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
      {/* <FaLock className='icon' /> */}
      </div>

      

      <label>
        <input type="checkbox" />
        Lembrar de mim
      </label>
      
      <button onClick={handleLogin}>Entrar</button>
      </form>
    </div>
  );
}

export default Login;

      
      
