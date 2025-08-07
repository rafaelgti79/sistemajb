// Função para formatar os dados de aposta

// Função para buscar o ponto do DB
export const buscarPonto = async (idPonto) => {
  try {
    const response = await fetch(`http://localhost:5000/pontos/${idPonto}`);
    const ponto = await response.json();
    return ponto;
  } catch (error) {
    console.error('Erro ao buscar o ponto:', error);
    throw error;
  }
};

// Função para buscar o usuário do DB
export const buscarUsuario = async (idUsuario) => {
  try {
    const response = await fetch(`http://localhost:5000/usuarios/${idUsuario}`);
    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    throw error;
  }
};



export const formatarDadosParaEnvio = async ({
  duqueGrupoPalpites,
  valor,
   ponto,        // Ponto a ser enviado
  usuario,      // Usuário a ser enviado
  cercSelecionado,
  centenaInvertido,
  milharNumerosSelecionados,
  milharCercSelecionado,
  milharInvertido,
  duquePalpites,
  duqueCercSelecionado,
  mcInvertido,
  duqueDezenaPalpites,
  ternoDezenaPalpites,
   
  
}) => {

    const pontoId = 2; // Definido para o exemplo
  const usuarioId = 252; // ID do usuário (deve vir da sua lógica)

  try {
    // Buscar o ponto e usuário do DB
    const ponto = await buscarPonto(pontoId); // Agora é assíncrono
    const usuario = await buscarUsuario(usuarioId); // Agora é assíncrono

  const dadosParaEnvio = {
    dataExtracao: new Date().toLocaleDateString(),
    horarioExtracao: new Date().toLocaleTimeString(),
    ponto: ponto.id, // Agora o ponto vem do DB
    usuario: usuario.id, // O ID do usuário vem do DB
  //  token: "fre5567hhdg", // Token gerado para a requisição
    palpites: []
  };

 /*  // Adicionando os palpites para diferentes modalidades
  if (numerosSelecionados.length > 0) {
    dadosParaEnvio.palpites.push({
      modalidade: 1,
      palpite: numerosSelecionados.join(','),
      valor: valor,
      cercado: cercSelecionado,
      invertido: centenaInvertido ? 1 : 0
    });
  }

  if (milharNumerosSelecionados.length > 0) {
    dadosParaEnvio.palpites.push({
      modalidade: 4,
      palpite: milharNumerosSelecionados.join(','),
      valor: valor,
      cercado: milharCercSelecionado,
      invertido: milharInvertido ? 1 : 0
    });
  }

  if (duquePalpites.length > 0) {
    dadosParaEnvio.palpites.push({
      modalidade: 2,
      palpite: duquePalpites.join(','),
      valor: valor,
      cercado: duqueCercSelecionado,
      invertido: mcInvertido ? 1 : 0
    });
  }

  // Adicionar outros palpites conforme o tipo (DuqueDezena, Terno, etc.)
  if (duqueDezenaPalpites.length > 0) {
    dadosParaEnvio.palpites.push({
      modalidade: 3, // DuqueDezena
      palpite: duqueDezenaPalpites.join(','),
      valor: valor,
      cercado: duqueCercSelecionado, // Cercado para DuqueDezena
      invertido: mcInvertido ? 1 : 0
    });
  }

  if (ternoDezenaPalpites.length > 0) {
    dadosParaEnvio.palpites.push({
      modalidade: 5, // TernoDezena
      palpite: ternoDezenaPalpites.join(','),
      valor: valor,
      cercado: duqueCercSelecionado, // Cercado para TernoDezena
      invertido: mcInvertido ? 1 : 0
    });
  }
 */
  return dadosParaEnvio;
} catch (error) {
    console.error("Erro ao formatar os dados para envio:", error);
    throw error;
  }
};

 // Função para enviar a aposta para o servidor
export const enviarAposta = async (dados) => {
  try {
    const response = await fetch('http://localhost:5000/extracoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const data = await response.json();
    console.log('Aposta enviada com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar a aposta:', error);
    throw error;
  }
}; 
