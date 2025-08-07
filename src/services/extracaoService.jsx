// extracaoService.js
import { v4 as uuidv4 } from 'uuid';


const formatarComDoisDigitos = (numeros) => {
  return numeros.map(num => num.toString().padStart(2, '0')).join(',');
};

//Função para gerar o cercado de 0 e 1 
  const gerarCercado = (cercSelecionado) => {
  return Array.from({ length: 8 }, (_, i) => (i < cercSelecionado ? '1' : '0')).join('');
};


const BASE_URL = 'http://localhost:5000/palpites';

// CREATE
export const enviarPalpiteParaServidor = async (palpite) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palpite)
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar palpite:', error);
  }
};

/* // READ (listar todos os palpites)
export const buscarPalpitesDoServidor = async () => {
  try {
    const response = await fetch(BASE_URL);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar palpites:', error);
    return [];
  }
}; */

// DELETE
export const excluirPalpiteDoServidor = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao excluir palpite:', error);
    return false;
  }
};

// UPDATE (se necessário no futuro)
export const atualizarPalpiteNoServidor = async (id, palpiteAtualizado) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palpiteAtualizado)
    });
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar palpite:', error);
  }
};



//Salvar palpite
export const adicionarPalpiteService = ({
  grupoSelecionado,
  duqueGrupoPalpites,
  valor,
  cercSelecionado,
  palpitesSalvos,
  setPalpitesSalvos,
  setNumerosSelecionados,
  setCercSelecionado,
  horarioSelecionado
}) => {
  if (!duqueGrupoPalpites.length) return;

  const novoPalpite = {
    id: uuidv4(), // Gera um ID único
    modalidade: grupoSelecionado,
    palpite: formatarComDoisDigitos(duqueGrupoPalpites),
    valor: parseFloat(valor.replace(',', '.')),
    cercado: gerarCercado(cercSelecionado),
    invertido: 0,
    horarioSelecionado
  };

  // Apenas salva localmente
  setPalpitesSalvos([...palpitesSalvos, novoPalpite]);

  // Limpa inputs
  //setNumerosSelecionados([]);
  //setCercSelecionado(null);
  
};



// Função para adicionar uma nova extração
export const adicionarExtracao = async ({
  ponto,
  usuario,
  credito,
  palpites,
  horarioSelecionado
}) => {
  const novaExtracao = {
    dataExtracao: new Date().toLocaleDateString(),
    //horarioExtracao: new Date().toLocaleTimeString(),
    horarioExtracao: horarioSelecionado || new Date().toLocaleTimeString(),
    ponto,
    usuario,
    credito,
    palpites  // agora vem todos os palpites adicionados
  };

  try {
    const resposta = await fetch('http://localhost:5000/extracoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novaExtracao),
    });

    const resultado = await resposta.json();
    //console.log('Nova extração adicionada:', resultado);
    return resultado;
  } catch (error) {
    console.error('Erro ao adicionar nova extração:', error);
    throw error;
  }
};




