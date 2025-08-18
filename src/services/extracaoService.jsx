// extracaoService.js
import { v4 as uuidv4 } from 'uuid';
import api from '../constants/api';




const formatarComDoisDigitos = (numeros) => {
  return numeros.map(num => num.toString().padStart(2, '0')).join(',');
};

//Função para gerar o cercado de 0 e 1 
  const gerarCercado = (cercSelecionado) => {
  return Array.from({ length: 8 }, (_, i) => (i < cercSelecionado ? '1' : '0')).join('');
};


/* const BASE_URL = 'http://localhost:5000/palpites';

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
 */


//Salvar palpite
export const adicionarPalpiteService = ({
  grupoSelecionado,
  grupoPalpites,
  dezenaPalpites,
  centenaPalpites,
  milharPalpites,
  duqueGrupoPalpites,
  duqueDezenaPalpites,
  valor,
  cercSelecionado,
  palpitesSalvos,
  setPalpitesSalvos,
  ternoDezenaPalpites,
  ternoGrupoPalpites,
  milharCentenaPalpites,
  dezeninhaPalpites,
  globalInvertido,
  setNumerosSelecionados,
  setCercSelecionado,
  horarioSelecionado
}) => {
  let numerosSelecionadosFormatados = '';

  if (grupoSelecionado === '1' && grupoPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(grupoPalpites);
  }

  if (grupoSelecionado === '2' && dezenaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(dezenaPalpites);
  }

  if (grupoSelecionado === '3' && centenaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(centenaPalpites);
  }
   if (grupoSelecionado === '4' && milharPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(milharPalpites);
  }

  if (grupoSelecionado === '5' && duqueGrupoPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(duqueGrupoPalpites);
  }

  if (grupoSelecionado === '6' && duqueDezenaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(duqueDezenaPalpites);
  }

  if (grupoSelecionado === '7' && ternoDezenaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(ternoDezenaPalpites);
  }

  if (grupoSelecionado === '8' && ternoGrupoPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(ternoGrupoPalpites);
  }

  if (grupoSelecionado === '9' && milharCentenaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(milharCentenaPalpites);
  }

  if (grupoSelecionado === '10' && dezeninhaPalpites.length) {
    numerosSelecionadosFormatados = formatarComDoisDigitos(dezeninhaPalpites);
  }

  if (!numerosSelecionadosFormatados) return;

  const novoPalpite = {
   // area: area,   
    modalidade: grupoSelecionado,
    palpite: numerosSelecionadosFormatados.split(","), // todos juntos no mesmo palpite
    valor: parseFloat(valor.replace(',', '.')),
    cercado: gerarCercado(cercSelecionado)
    .toString()
    .split("")
    .map(n => parseInt(n, 10)),
    invertido: globalInvertido,
    
    //grupo: grupoSelecionado, // associa o grupo atual ao palpite
  };

  // Adiciona no array de palpites
  setPalpitesSalvos([...palpitesSalvos, novoPalpite]);

  // Se quiser limpar seleção
  // setNumerosSelecionados([]);
  // setCercSelecionado(null);
};



export const adicionarExtracao = async ({
  area: area,
  ponto,
  usuario,
  credito,
  palpites,
  horarioSelecionado,
  dataSelecionada,
  token
}) => {
  const novaExtracao = {
    area,
    
    //dataExtracao: new Date().toLocaleDateString(),
    dataExtracao: dataSelecionada, 
	  horarioExtracao: horarioSelecionado, 
    //horarioExtracao: new Date().toLocaleTimeString(),
    //horarioExtracao: horarioSelecionado || new Date().toLocaleTimeString(),
    ponto,
    usuario,
    credito,
    palpites,  // agora vem todos os palpites adicionados
    token
  };

 // ✅ Log do que será enviado
  console.log("Dados enviados via POST:", novaExtracao);

  try {
    const resposta = await api.post('/gravaPalpites.php', novaExtracao, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ✅ Log da resposta do servidor
    console.log("Resposta do servidor:", resposta.data);

    return resposta.data;
  } catch (error) {
    console.error('Erro ao adicionar nova extração:', error);
    throw error;
  }
};
/* // Função para adicionar uma nova extração
export const adicionarExtracao = async ({
  ponto,
  usuario,
  credito,
  palpites,
  horarioSelecionado
}) => {
  const novaExtracao = {
    dataExtracao: new Date().toLocaleDateString(),
    horarioExtracao: horarioSelecionado || new Date().toLocaleTimeString(),
    ponto,
    usuario,
    credito,
    palpites
  };

  try {
   const resposta = await api.post("/extracoes", novaExtracao);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao adicionar nova extração:", error);
    throw error;
  }
};

 */

//gravaPalpites.php

/* {
  "credito": 0,
  "dataExtracao": "15/08/2025",
  "horarioExtracao": "21 Horas",
  "palpites": [
    {
      "cercado": [1,0,0,0,0,0,0,0],
      "grupo": "1",
      "horarioSelecionado": null,
      "usuario": 347,
      "invertido": 0,
      "modalidade": "1",
      "palpite": ["01","02"],
      "token": "e825159f92125bfbc0998df2fac07574",
      "valor": 2
    }
  ],
  "ponto": 24
  
} */

/* {
  "credito": 0,
  "dataExtracao": "15/08/2025",
  "horarioExtracao": "21 Horas",
  "usuario": 347,
  "ponto": 24,
  "palpites": [
    {
       "modalidade": 1,
       "palpite": ["01","02"],
       "valor": 2,
      "cercado": [1,0,0,0,0,0,0,0],
      "grupo": "1",
      "invertido": 0}
     ],
      
      "token": "e825159f92125bfbc0998df2fac07574"
    } */