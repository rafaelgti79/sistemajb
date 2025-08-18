import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../constants/api.js';
import './login.css';

function Home() {
const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    // Aqui evita que a UI renderize enquanto redireciona
    return null;
  }

  const { loading } = useAuth();

if (loading) return <p>Carregando...</p>;
if (!user) return <p>Você não está autenticado.</p>;

  const tipo = user.tipo;
  const nomeUsuario = user.nome;

  const [caixas, setCaixas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [cartao, setCartao] = useState([]);
  const [reforco, setReforco] = useState([]);
  const [dinheiro, setDinheiro] = useState([]);
  const [sangria, setSangria] = useState([]);

  useEffect(() => {
    const params = tipo === 'admin'
      ? { status: 'aberto' }
      : { status: 'aberto', usuario: nomeUsuario };

    api.get('/caixa', { params })
      .then(res => setCaixas(res.data))
      .catch(err => console.error('Erro ao carregar caixas:', err));

    api.get('/despesas')
      .then(res => setDespesas(res.data))
      .catch(err => console.error('Erro ao carregar despesas:', err));

    api.get('/cartao')
      .then(res => setCartao(res.data))
      .catch(err => console.error('Erro ao carregar cartoes:', err));

    api.get('/reforco')
      .then(res => setReforco(res.data))
      .catch(err => console.error('Erro ao carregar reforço:', err));

    api.get('/dinheiro')
      .then(res => setDinheiro(res.data))
      .catch(err => console.error('Erro ao carregar dinheiro:', err));

    api.get('/sangria')
      .then(res => setSangria(res.data))
      .catch(err => console.error('Erro ao carregar sangria:', err));
  }, [tipo, nomeUsuario]);

  return (
    <div className="containerhome">
      <div className="colunatabel">
        {(tipo === "admin" || tipo === "caixa") && (
          <>
            <Link to="/app/abrir-caixa">Abrir Caixa</Link>
            <Link to="/app/fechamento">Fechamento</Link>
          </>
        )}
        {tipo === "admin" && (
          <>
            <Link to="/app/lista-maquinas">Lista de Máquinas</Link>
            <Link to="/app/cadastros">Cadastros Gerais</Link>
            <Link to="/app/relatorios">Relatório</Link>
            <Link to="/app/procurar-erros">Procurar Erros</Link>
            <Link to="/app/gerenciar-cozinha">Gerenciar Cozinha</Link>
            <Link to="/app/checar-leitura">Checar Leitura</Link>
            <Link to="/app/gerenciar-sistema">Gerenciar Sistema</Link>
            <Link to="/app/pagamento-superios">Pagamento Superior</Link>
            <Link to="/app/procurar-pagamentos">Procurar Pagamentos</Link>
          </>
        )}
        {(tipo === "admin" || tipo === "operador") && (
          <Link to="/app/despesas-extra">Despesas Extras</Link>
        )}
      </div>

      <div>
        <ul className="grid-list">
          {caixas && caixas.length > 0 ? (
            caixas.map(item => {
              const somaParaUsuario = arr =>
                arr
                  .filter(d => d.usuario === item.usuario)
                  .reduce((total, d) => total + Number(d.valor), 0)
                  .toFixed(2);

              return (
                <li key={item.id} className="grid-item">
                  <div className="grid-row"><span className="label">CONTA:</span> <span className="value">{item.usuario}</span></div>
                  <div className="grid-row"><span className="label">DATA:</span> <span className="value">{item.data}</span></div>
                  <div className="grid-row"><span className="label">SETOR:</span> <span className="value">{item.setor}</span></div>
                  <div className="grid-row"><span className="label">FUNDO INICIAL:</span> <span className="value">R$ {item.fundoInicial}</span></div>
                  <div className="grid-row"><span className="label">LOJA:</span> <span className="value">{item.loja}</span></div>
                  
                  <p>INFORMAÇÕES DO CAIXA</p>
                  <div className="grid-row"><span className="label">Fechamento:</span> <span className="value">0</span></div>

                  <div className="grid-row"><span className="label">Despesas:</span> <span className="value">R$ {somaParaUsuario(despesas)}</span></div>
                  <div className="grid-row"><span className="label">Dinheiro:</span> <span className="value">R$ {somaParaUsuario(dinheiro)}</span></div>
                  <div className="grid-row"><span className="label">Reforço:</span> <span className="value">R$ {somaParaUsuario(reforco)}</span></div>
                  <div className="grid-row"><span className="label">Cartões:</span> <span className="value">R$ {somaParaUsuario(cartao)}</span></div>
                  <div className="grid-row"><span className="label">Sangria:</span> <span className="value">R$ {somaParaUsuario(sangria)}</span></div>
                  
                  <p>PARCIAL DO CAIXA</p>
                  <div className="grid-row"><span className="label">Arrecadações:</span> <span className="value">0</span></div>
                  <div className="grid-row"><span className="label">Pagamentos:</span> <span className="value">0</span></div>
                  <div className="grid-row"><span className="label">Resultado parcial:</span> <span className="value">0</span></div>
                </li>
              );
            })
          ) : (
            <p>Nenhum caixa aberto no momento.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Home;
