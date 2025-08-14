import { useState, useEffect, useCallback  } from 'react';
import EscPosEncoder from './utils/EscPosEncoder';
//import { formatarDadosParaEnvio, enviarAposta } from './services/apostas'; // Importando as funções
import { adicionarExtracao, adicionarPalpiteService } from './services/extracaoService';  // Importando a função de adicionar extração
import CurrencyInput from 'react-currency-input-field';
import QRCode from 'qrcode';
import './App.css';



const bichos = [
  'Avestruz', 'Águia', 'Burro', 'Borboleta', 'Cachorro',
  'Cabra', 'Carneiro', 'Camelo', 'Cobra', 'Coelho',
  'Cavalo', 'Elefante', 'Galo', 'Gato', 'Jacaré',
  'Leão', 'Macaco', 'Porco', 'Pavão', 'Peru',
  'Touro', 'Tigre', 'Urso', 'Veado', 'Vaca'
];


function App() {

const [credito, setCredito] = useState(0);
const [grupo, setGrupo] = useState('');
const [valor, setValor] = useState('');
const [mensagem, setMensagem] = useState('');
const [historico, setHistorico] = useState([]);
const [portaSerial, setPortaSerial] = useState(null);
const [printerStatus, setPrinterStatus] = useState('🔌 Procurando impressora...');
const [grupoSelecionado, setGrupoSelecionado] = useState(null);
const [mostrarCercas, setMostrarCercas] = useState(false);
const [numerosSelecionados, setNumerosSelecionados] = useState([1]);
const [cercSelecionado, setCercSelecionado] = useState([]);
const [dezenaNumerosSelecionados, setDezenaNumerosSelecionados] = useState([]);
const [dezenaCercSelecionado, setDezenaCercSelecionado] = useState(null);
const [centenaNumerosSelecionados, setCentenaNumerosSelecionados] = useState([]);
const [centenaCercSelecionado, setCentenaCercSelecionado] = useState(null);

const [milharCercSelecionado, setMilharCercSelecionado] = useState(null);
const [milharNumerosSelecionados, setMilharNumerosSelecionados] = useState([]);
const [milharInvertido, setMilharInvertido] = useState(false);
const [duquePalpites, setDuquePalpites] = useState([]);

const [ternoDezenaPalpites, setTernoDezenaPalpites] = useState([]);
const [ternoGrupoPalpites, setTernoGrupoPalpites] = useState([]);
const [mcInvertido, setMcInvertido] = useState(false);
const [mcCercSelecionado, setMcCercSelecionado] = useState(null);
const [mcNumerosSelecionados, setMcNumerosSelecionados] = useState([]);
const [dezenaModalidade, setDezenaModalidade] = useState(null); // pode ser "Terno", "Quadra", "Quina"
const [dezenaDezenaPalpites, setDezenaDezenaPalpites] = useState([]);
const [duqueDmePalpites, setDuqueDmePalpites] = useState([]);
const [ternoDmePalpites, setTernoDmePalpites] = useState([]);

const [grupoPalpites, setGrupoPalpites] = useState([]);
const [showModal, setShowModal] = useState(false);  // Estado para controlar a visibilidade do modal
const [finalizarAposta, setFinalizarAposta] = useState(false);  // Estado para controle da finalização da aposta
const [horarioSelecionado, setHorarioSelecionado] = useState('');
const [dataSelecionado, setDataSelecionado] = useState('');
const [ponto, setPonto] = useState(12);  // Exemplo de ponto
const [usuario, setUsuario] = useState(252); // Exemplo de usuário
const [palpitesSalvos, setPalpitesSalvos] = useState([]);

const [dezenaPalpites, setDezenaPalpites] = useState([]);
const [centenaPalpites, setCentenaPalpites] = useState([]);
const [milharPalpites, setMilharPalpites] = useState([]);
const [duqueGrupoPalpites, setDuqueGrupoPalpites] = useState([]);
const [duqueDezenaPalpites, setDuqueDezenaPalpites] = useState([]);
const [duqueDezenaNumerosSelecionados, setDuqueDezenaNumerosSelecionados] = useState([]);
const [ternoDezenaNumerosSelecionados, setTernoDezenaNumerosSelecionados] = useState([]); 
const [milharCentenaPalpites, setMilharCentenaPalpites] = useState([]); 
const [milharCentenaNumerosSelecionados, setMilharCentenaNumerosSelecionados] = useState([]); 
const [dezeninhaPalpites, setDezeninhaPalpites] = useState([]); 
const [dezeninhaNumerosSelecionados, setDezeninhaNumerosSelecionados] = useState([]); 
const [globalInvertido, setGlobalInvertido] = useState(0);

const [abrindoPorta, setAbrindoPorta] = useState(false);
const [idImpressoraSalva, setIdImpressoraSalva] = useState(null);

const nomesDosGrupos = {
  '1': 'Grupo',
  '2': 'Dezena',
  '3': 'Centena',
  '4': 'Milhar',
  '5': 'Duque de Grupo',
  '6': 'Duque de Centena',
  '7': 'Terno de Dezena',
  '8': 'Terno de Grupo',
  '9': 'Milhar e Centema',
  '10': 'Dezeninha',
  // adicione quantos grupos precisar...
};


/////////////////////INICIO///////////////////
//Salvar palpites no localStorage sempre que forem atualizados:
useEffect(() => {
localStorage.setItem('palpitesSalvos', JSON.stringify(palpitesSalvos));
}, [palpitesSalvos]);

//Restaurar palpites salvos do localStorage quando o componente for montado:
useEffect(() => {
const dadosSalvos = localStorage.getItem('palpitesSalvos');
if (dadosSalvos) {
setPalpitesSalvos(JSON.parse(dadosSalvos));
}
}, []);

//remover palpite
const removerPalpite = (id) => {
const atualizados = palpitesSalvos.filter(p => p.id !== id);
setPalpitesSalvos(atualizados);
localStorage.setItem('palpitesSalvos', JSON.stringify(atualizados));
};
////////////FIM/////////////////////////

//Somo para os palpites
const somaTotal = palpitesSalvos.reduce((acc, p) => acc + (p.valor || 0), 0);


/////////////////////INICIO///////////////////


// Converte canvas para ESC/POS (bitmap)
const converterCanvasParaEscPos = (canvas) => {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const bytesPerLine = Math.ceil(width / 8);
  const buffer = [];

  for (let y = 0; y < height; y++) {
    buffer.push(0x1d, 0x76, 0x30, 0x00); // comando GS v 0
    buffer.push(bytesPerLine % 256, Math.floor(bytesPerLine / 256)); // largura em bytes
    buffer.push(1, 0); // altura de 1 linha por vez (ajustar se precisar)

    for (let xByte = 0; xByte < bytesPerLine; xByte++) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const x = xByte * 8 + bit;
        if (x < width) {
          const idx = (y * width + x) * 4;
          const pixelOn = data[idx] < 128; // threshold para preto/branco
          if (pixelOn) byte |= (0x80 >> bit);
        }
      }
      buffer.push(byte);
    }
  }

  return new Uint8Array(buffer);
};

// Gera QR Code e retorna ESC/POS
const gerarQRCodeBytes = async (text) => {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, { width: 200 });
  return converterCanvasParaEscPos(canvas);
};
////////////FIM/////////////////////////



/////////////////////INICIO///////////////////
const adicionarPalpite = async () => {
 await adicionarPalpiteService({
    grupoSelecionado,   //Modalidade do grupo ex.. 1 
    grupoPalpites,
    dezenaPalpites,
    centenaPalpites,
    milharPalpites,
    duqueGrupoPalpites,
    duqueDezenaPalpites,
    ternoDezenaPalpites,
    ternoGrupoPalpites,
    milharCentenaPalpites,
    dezeninhaPalpites,
    globalInvertido,
   
    valor,
    cercSelecionado,
    palpitesSalvos,
    setPalpitesSalvos,
    setNumerosSelecionados,
    setCercSelecionado
  });
  
  setGrupoPalpites([]);
  setDezenaPalpites([]);
  setMilharPalpites([]);
  setDuqueGrupoPalpites([]);
  setDuqueDezenaPalpites([]);
  setTernoDezenaPalpites([]);
  setTernoGrupoPalpites([]);
  setMilharCentenaPalpites([]);
  setDezeninhaPalpites([]);
};
////////////FIM/////////////////////////

// Função utilitária para verificar se a porta está aberta
const impressoraEstaAberta = (porta) => {
  return porta?.readable && porta?.writable;
};

// Gerar ID único com dados reais da porta
const gerarIdImpressora = (port) => {
  const info = port.getInfo();
  const vendor = info.usbVendorId || 'unknownVendor';
  const product = info.usbProductId || 'unknownProduct';
  return `${vendor}-${product}`;
};

// Seleciona impressora apenas na primeira vez
const selecionarImpressora = async () => {
  try {
    const port = await navigator.serial.requestPort();
    if (!impressoraEstaAberta(port)) {
      await port.open({ baudRate: 9600 });
    }

    setPortaSerial(port);
    setPrinterStatus('✅ Impressora selecionada manualmente');

    // Salva ID único real da impressora
    const idReal = gerarIdImpressora(port);
    localStorage.setItem('idImpressoraSalva', idReal);

  } catch (err) {
    console.warn('❌ Impressora não selecionada:', err);
    setPrinterStatus('❌ Impressora não selecionada');
  }
};

// Conecta automaticamente usando ID salvo
const conectarImpressoraAutomaticamente = useCallback(async () => {
  try {
    const idSalvo = localStorage.getItem('idImpressoraSalva');
    if (!idSalvo) {
      setPrinterStatus('⚠️ Nenhuma impressora salva — selecione manualmente');
      return;
    }

    const ports = await navigator.serial.getPorts();
    const portaEncontrada = ports.find(port => gerarIdImpressora(port) === idSalvo);

    if (!portaEncontrada) {
      setPrinterStatus('❌ Impressora anterior não encontrada');
      setPortaSerial(null);
      return;
    }

    // Só abre se ainda não estiver aberta
    if (!impressoraEstaAberta(portaEncontrada)) {
      await portaEncontrada.open({ baudRate: 9600 });
    }

    setPortaSerial(portaEncontrada);
    setPrinterStatus('✅ Impressora reconectada automaticamente');

  } catch (err) {
    console.warn('⚠️ Falha ao reconectar impressora:', err);
    setPrinterStatus('⚠️ Erro ao conectar automaticamente');
    setPortaSerial(null);
  }
}, []);

// Auto-conectar ao iniciar
useEffect(() => {
  conectarImpressoraAutomaticamente();
}, [conectarImpressoraAutomaticamente]);

// Função de impressão
// Ajuste na função de impressão para receber 'novaExtracao'
const imprimirPalpites = async (palpites, novaExtracao) => {
  if (!impressoraEstaAberta(portaSerial)) {
    alert("❌ Impressora não conectada");
    return;
  }

  try {
    const writer = portaSerial.writable.getWriter();
    const encoder = new TextEncoder();

    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString();
    const horaFormatada = horarioSelecionado || dataAtual.toLocaleTimeString();

    let texto = "";
    texto += "***************\n";
    texto += "   BILHETE\n";
    texto += "***************\n\n";
    texto += `Usuário: ${usuario}\n`;
    texto += `Data: ${dataFormatada}\n`;
    texto += `Hora: ${horaFormatada}\n\n`;

    // Soma total dos palpites
    const somaTotal = palpites.reduce((acc, p) => acc + (p.valor || 0), 0);
    texto += `TOTAL: R$ ${somaTotal.toFixed(2)}\n\n`;

    texto += "Palpites:\n";
    palpites.forEach((p, i) => {
      const nomeGrupo = nomesDosGrupos[p.grupo] || `Grupo ${p.grupo}`;
      texto += `${nomeGrupo} ${p.palpite} -R$:${p.valor.toFixed(2)}\n`;
    });

    // Envia texto do bilhete
    await writer.write(encoder.encode(texto));

    // Pequeno espaço antes do QR Code
    await writer.write(encoder.encode("\n\n"));

    // Gera e envia QR Code
    const qrBytes = await gerarQRCodeBytes(novaExtracao.id);
    await writer.write(qrBytes);

    // Mensagem de agradecimento no final
    await writer.write(encoder.encode("\nObrigado por jogar!\n\n\n"));

    
    // Finaliza impressão
    writer.releaseLock();

   // alert("✅ Cupom impresso com sucesso");
  } catch (error) {
    console.error("❌ Erro ao imprimir cupom:", error);
    alert("Erro ao imprimir cupom");
  }
};

// Finalizar aposta
const handleFinalizarAposta = async () => {
  if (!palpitesSalvos.length) {
    alert("Adicione ao menos um palpite antes de finalizar.");
    return;
  }

  try {
    // Se não tiver porta aberta, tenta reconectar
    if (!impressoraEstaAberta(portaSerial)) {
      await conectarImpressoraAutomaticamente();
    }

    // Ainda não conectou? então pede manualmente
    if (!impressoraEstaAberta(portaSerial)) {
      await selecionarImpressora();
    }

    // Adiciona a nova extração e armazena o retorno
    const novaExtracao = await adicionarExtracao({
      ponto,
      usuario,
      credito,
      palpites: palpitesSalvos,
      horarioSelecionado
    });

    console.log('Nova extração adicionada:', novaExtracao);

    // Agora passa 'novaExtracao' para imprimir
    await imprimirPalpites(palpitesSalvos, novaExtracao);

    setPalpitesSalvos([]);
    setValor('');
   // alert('Aposta finalizada e impressa com sucesso!');

  } catch (error) {
    console.error('Erro ao finalizar aposta:', error);
    alert('Erro ao finalizar aposta ou imprimir. Tente novamente.');
  }
};

////////////FIM/////////////////////////


/////////////////////INICIO///////////////////
const handleHorarioChange = (event) => {
setHorarioSelecionado(event.target.value);
};

const handleDataChange = (event) => {
setDataSelecionado(event.target.value);
};
////////////FIM/////////////////////////


/////////////////////INICIO///////////////////
  // Função para exibir o modal ao finalizar a aposta
  const handleFinalizar = () => {
    setShowModal(true);  // Exibe o modal quando o botão "Finalizar" for clicado
  };


  // Função para fechar o modal
  const fecharModal = () => {
    setShowModal(false);
  };
////////////FIM/////////////////////////



/////////////////////INICIO///////////////////
// Cercas Grupo
const toggleGrupoNumero = (num) => {
  if (grupoPalpites.includes(num)) {
    // Se já está incluído, remove
    setGrupoPalpites(grupoPalpites.filter(n => n !== num));
  } else {
    // Se ainda não está incluso, adiciona apenas se tiver menos de 20
    if (grupoPalpites.length < 20) {
      setGrupoPalpites([...grupoPalpites, num]);
    } else {
      alert("Você só pode selecionar até 20 Grupos.");
    }
  }
};

//--------------------//----------------------//

// Cercas Dezena
const toggleDezenaNumero = (num) => {
  if (dezenaNumerosSelecionados.length === 1) {
    // Já tem 1 dígito → cria dezena
    const dezena = `${dezenaNumerosSelecionados[0]}${num}`.padStart(2, '0');
    setDezenaPalpites([...dezenaPalpites, parseInt(dezena, 10)]);
    setDezenaNumerosSelecionados([]); // limpa para próxima dezena
  } else {
    // Escolhendo o primeiro dígito
    setDezenaNumerosSelecionados([num]);
  }
};

//--------------------//----------------------//

// Cercas para Dezena
const toggleDezenaCerc = (num) => {
  if (dezenaCercSelecionado === num) {
    setDezenaCercSelecionado(null);
    setDezenaNumerosSelecionados([]);
  } else {
    setDezenaCercSelecionado(num);
    const nums = Array.from({ length: num }, (_, i) => i + 1);
    setDezenaNumerosSelecionados(nums);
  }
};
//--------------------//----------------------//




// Cercas para Centena
const toggleCentenaNumero = (num) => {
  if (centenaNumerosSelecionados.length === 2) {
    // Já tem 2 dígitos → cria o número com 3 dígitos
    const numero = `${centenaNumerosSelecionados[0]}${centenaNumerosSelecionados[1]}${num}`.padStart(3, '0');
    setCentenaPalpites([...centenaPalpites, numero]);
    setCentenaNumerosSelecionados([]); // limpa para próxima entrada
  } else {
    // Adiciona o dígito clicado
    setCentenaNumerosSelecionados([...centenaNumerosSelecionados, num]);
  }
};


const toggleCentenaCerc = (num) => {
  if (centenaCercSelecionado === num) {
    setCentenaCercSelecionado(null);
    setCentenaNumerosSelecionados([]);
  } else {
    setCentenaCercSelecionado(num);
    const nums = Array.from({ length: num }, (_, i) => i + 1);
    setCentenaNumerosSelecionados(nums);
  }
};
//--------------------//----------------------//

// Função para montar o milhar
const toggleMilharNumero = (num) => {
  if (milharNumerosSelecionados.length === 3) {
    // Já tem 3 dígitos → cria o número com 4 dígitos
    const numero = `${milharNumerosSelecionados[0]}${milharNumerosSelecionados[1]}${milharNumerosSelecionados[2]}${num}`;
    setMilharPalpites([...milharPalpites, numero.padStart(4, '0')]);
    setMilharNumerosSelecionados([]); // limpa para próxima entrada
  } else {
    // Adiciona o dígito clicado
    setMilharNumerosSelecionados([...milharNumerosSelecionados, num]);
  }
};

const toggleMilharCerc = (num) => {
  if (milharCercSelecionado === num) {
    setMilharCercSelecionado(null);
    setMilharNumerosSelecionados([]);
  } else {
    setMilharCercSelecionado(num);
    const nums = Array.from({ length: num }, (_, i) => i + 1);
    setMilharNumerosSelecionados(nums);
  }
};
//--------------------//----------------------//

// Cercas para Duque De Grupo
const adicionarDuqueGrupoAleatorio = () => {
  if (duqueGrupoPalpites.length >= 25) return;
  let novo;
  do {
    novo = Math.floor(Math.random() * 25) + 1;
  } while (duqueGrupoPalpites.includes(novo));
  setDuqueGrupoPalpites([...duqueGrupoPalpites, novo]);
};
//--------------------//----------------------//


const toggleDuqueGrupoNumero = (num) => {
  if (duqueGrupoPalpites.includes(num)) {
    // Se já está incluído, remove
    setDuqueGrupoPalpites(duqueGrupoPalpites.filter(n => n !== num));
  } else {
    // Se ainda não está incluso, adiciona apenas se tiver menos de 20
    if (duqueGrupoPalpites.length < 20) {
      setDuqueGrupoPalpites([...duqueGrupoPalpites, num]);
    } else {
      alert("Você só pode selecionar até 20 Grupos.");
    }
  }
};

//--------------------//----------------------//



const adicionarDuqueDezenaAleatorio = () => {
  if (duqueDezenaPalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10); // 0 a 9
  if (!duqueDezenaPalpites.includes(novo)) {
    setDuqueDezenaPalpites([...duqueDezenaPalpites, novo]);
  }
};
//--------------------//----------------------//

const toggleDuqueDezenaNumero = (num) => {
  if (duqueDezenaNumerosSelecionados.length === 1) {
    // Já tem 1 dígito → cria o número com 2 dígitos
    const numero = `${duqueDezenaNumerosSelecionados[0]}${num}`;
    setDuqueDezenaPalpites([...duqueDezenaPalpites, numero.padStart(2, '0')]);
    setDuqueDezenaNumerosSelecionados([]); // limpa para próxima entrada
  } else {
    // Adiciona o dígito clicado
    setDuqueDezenaNumerosSelecionados([...duqueDezenaNumerosSelecionados, num]);
  }
};

//--------------------//----------------------//

// Cercas para Duque De Terno de Dezena
const adicionarTernoDezenaAleatorio = () => {
  if (ternoDezenaPalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10); // 0 a 9
  if (!ternoDezenaPalpites.includes(novo)) {
    setTernoDezenaPalpites([...ternoDezenaPalpites, novo]);
  }
};

const toggleTernoDezenaNumero = (num) => {
  if (ternoDezenaNumerosSelecionados.length === 1) {
    // Já tem 1 dígito → cria o número com 2 dígitos
    const numero = `${ternoDezenaNumerosSelecionados[0]}${num}`;
    setTernoDezenaPalpites([...ternoDezenaPalpites, numero.padStart(2, '0')]);
    setTernoDezenaNumerosSelecionados([]); // limpa para próxima entrada
  } else {
    // Adiciona o dígito clicado
    setTernoDezenaNumerosSelecionados([...ternoDezenaNumerosSelecionados, num]);
  }
};

//--------------------//----------------------//

// Cercas para Duque De Terno de Grupo
const adicionarTernoGrupoAleatorio = () => {
  if (ternoGrupoPalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 25) + 1; // 1 a 25
  if (!ternoGrupoPalpites.includes(novo)) {
    setTernoGrupoPalpites([...ternoGrupoPalpites, novo]);
  }
};

const toggleTernoGrupoNumero = (num) => {
  if (ternoGrupoPalpites.includes(num)) {
    // Se já está incluído, remove
    setTernoGrupoPalpites(ternoGrupoPalpites.filter(n => n !== num));
  } else {
    // Se ainda não está incluso, adiciona apenas se tiver menos de 20
    if (duqueGrupoPalpites.length < 20) {
      setTernoGrupoPalpites([...ternoGrupoPalpites, num]);
    } else {
      alert("Você só pode selecionar até 20 Grupos.");
    }
  }
};
//--------------------//----------------------//


const toggleMilharCentenaNumero = (num) => {
  if (milharCentenaNumerosSelecionados.length === 3) {
    // Já tem 3 dígitos → cria o número com 4 dígitos
    const numero = `${milharCentenaNumerosSelecionados[0]}${milharCentenaNumerosSelecionados[1]}${milharCentenaNumerosSelecionados[2]}${num}`;
    setMilharCentenaPalpites([...milharCentenaPalpites, numero.padStart(4, '0')]);
    setMilharCentenaNumerosSelecionados([]); // limpa para próxima entrada
  } else {
    // Adiciona o dígito clicado
    setMilharCentenaNumerosSelecionados([...milharCentenaNumerosSelecionados, num]);
  }
};



// Cercas para Milhar e Centena
const toggleMcNumero = (num) => {
  if (mcNumerosSelecionados.includes(num)) {
    setMcNumerosSelecionados(mcNumerosSelecionados.filter(n => n !== num));
  } else {
    setMcNumerosSelecionados([...mcNumerosSelecionados, num]);
  }
};


const toggleMcCerc = (num) => {
  if (mcCercSelecionado === num) {
    setMcCercSelecionado(null);
    setMcNumerosSelecionados([]);
  } else {
    setMcCercSelecionado(num);
    
    let limite = 7;
    if (num === 5) limite = 5;

    const nums = Array.from({ length: limite }, (_, i) => i + 1);
    setMcNumerosSelecionados(nums);
  }
};

//--------------------//----------------------//

// Cercas para Dezeninha
const adicionarDezeninhaAleatorio = () => {
  if (dezenaDezenaPalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10); // 0 a 9
  if (!dezenaDezenaPalpites.includes(novo)) {
    setDezenaDezenaPalpites([...dezenaDezenaPalpites, novo]);
  }
};

const toggleDezeninhaNumero = (num) => {
  if (dezeninhaNumerosSelecionados.length === 1) {
    // Já tem 1 dígito → cria dezena
    const dezena = `${dezeninhaNumerosSelecionados[0]}${num}`.padStart(2, '0');
    setDezeninhaPalpites([...dezeninhaPalpites, parseInt(dezena, 10)]);
    setDezeninhaNumerosSelecionados([]); // limpa para próxima dezena
  } else {
    // Escolhendo o primeiro dígito
    setDezeninhaNumerosSelecionados([num]);
  }
};
//--------------------//----------------------//

// Função para alternar entre 0 e 1
  const invertido = () => {
    setGlobalInvertido(prev => (prev === 0 ? 1 : 0));
  };

///////////////////////////////////FIM//////////////////////////////////////



// ==== INÍCIO DA ALTERAÇÃO: função para alternar cercas =====
  const toggleCerc = (num) => {
    if (cercSelecionado === num) {
      // clicou no mesmo cerc, limpar seleção (desistiu)
      setCercSelecionado(null);
      setNumerosSelecionados([1]);
    } else {
      // seleciona o cerc e marca os números de 1 até num
      setCercSelecionado(num);
      const nums = Array.from({ length: num }, (_, i) => i + 1);
      setNumerosSelecionados(nums);
    }
  };
  // ==== FIM DA ALTERAÇÃO =====



 // ==== INÍCIO DA ALTERAÇÃO: função para alternar números individualmente =====
 const toggleNumero = (num) => {
if (num === 1) return; // Impede que o número 1 seja desmarcado

if (numerosSelecionados.includes(num)) {
setNumerosSelecionados(numerosSelecionados.filter(n => n !== num));
} else {
setNumerosSelecionados([...numerosSelecionados, num]);
}
};
  // ==== FIM DA ALTERAÇÃO =====

 

//Adiciona Saldo com a letra p.
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'p') {
        setCredito((prev) => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
 // ==== FIM DO BLOCO =====


 
  return (
<div className="container">

 <div className="topo-container">
  <div className="saldo-box">Saldo R$: {credito}</div> {/* 🪙 Agora fixo no topo */}
  <h1 className="titulo-fixo">Jogo do Bicho</h1>

</div>

<div>
<select id="horario" value={horarioSelecionado} onChange={handleHorarioChange}>
<option value="">HORARIO</option>
<option value="14:00">14 HORAS</option>
<option value="18:00">18 HORAS</option>
</select>

<select id="horario" value={dataSelecionado} onChange={handleDataChange}>
<option value="">DATA</option>
<option value="07/08">07/08/2025</option>
<option value="08/08">08/07/2025</option>
</select>
</div>      


<div className="grupo-grid">
  <div
  className={`grupo-box ${grupoSelecionado === '1' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '1' ? null : '1')}
  >
    
  Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '2' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '2' ? null : '2')}
  >
  Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '3' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '3' ? null : '3')}
  >
  Centena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '4' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '4' ? null : '4')}
  >
  Milhar
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '5' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '5' ? null : '5')}
  >
  Duque de Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '6' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '6' ? null : '6')}
  >
  Duque de Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '7' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '7' ? null : '7')}
  >
  Terno de Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '8' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '8' ? null : '8')}
  >
  Terno de Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === '9' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '9' ? null : '9')}
  >
  Milhar e Centena
  </div>
  
  <div
  className={`grupo-box ${grupoSelecionado === '10' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === '10' ? null : '10')}
  >
  Dezeninha
  </div>
  
    

</div>

{/* ==== INÍCIO DA ALTERAÇÃO: mostrar cercas e números só se Grupo estiver selecionado ==== */}
<div className="cercamento-reservado">
   
  {/* /Renderize os elementos do Grupo 1 */}   
  {grupoSelecionado === '1' && (
    <>
      <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center' }}>
        {[5, 6, 7, 8].map(num => (
          <div
            key={num}
            className={`cerca-box ${cercSelecionado === num ? 'selecionado' : ''}`}
            onClick={() => toggleCerc(num)}
            style={{ cursor: 'pointer', margin: '0 10px' }}
          >
          
            Cerc.{num}
          </div>
        ))}
      </div>

      <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
          <div
            key={num}
            className={`numero-box ${numerosSelecionados.includes(num) ? 'selecionado' : ''}`}
            onClick={() => toggleNumero(num)}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          >
            {num}
          </div>
        ))}
      </div>

      <div
      className="numeros-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gap: '8px',
        justifyContent: 'center'
      }}
    >
      {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
        <div
          key={`duque-grupo-${num}`}
          className={`numero-box ${grupoPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleGrupoNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: grupoPalpites.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
    </>
  )}

  {/* /Renderize os elementos da Dezena 2 */}
  {grupoSelecionado === '2' && (
  <div className="cercamento-reservado">

    {/* Cercas */}
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center' }}>
      {[5, 6, 7].map(num => (
        <div
          key={`dezena-cerc-${num}`}
          className={`cerca-box ${cercSelecionado === num ? 'selecionado' : ''}`}
          onClick={() => toggleCerc(num)}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        >
          Cerc.{num}
        </div>
      ))}
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
        {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
          <div
            key={num}
            className={`numero-box ${numerosSelecionados.includes(num) ? 'selecionado' : ''}`}
            onClick={() => toggleNumero(num)}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          >
            {num}
          </div>
        ))}

      </div>
       



    <div style={{ margin: '10px 0', textAlign: 'center' }}>
      
       {/* Palpites adicionados */}
      {dezenaPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Números 0 a 9 */}
    <div className="numeros-grid" style={{ justifyContent: 'center' }}>
      {Array.from({ length: 10 }, (_, i) => i).map(num => (
        <div
          key={`digito-${num}`}
          className="numero-box"
          onClick={() => toggleDezenaNumero(num)}
          style={{
            cursor: 'pointer',
            margin: '0 5px',
            backgroundColor: dezenaNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num.toString().padStart(1, '0')}
        </div>
      ))}
    </div>

    {/* Mostrar dezenas formadas */}
    <div style={{ marginTop: '15px', textAlign: 'center' }}>
      <strong>Dezenas formadas:</strong> {dezenaPalpites.map(d => d.toString().padStart(2, '0')).join(', ')}
    </div>

    
  </div>
)}


{/* /Renderize os elementos da Centena 3 */}
{grupoSelecionado === '3' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div
        className={`cerca-box ${globalInvertido === 1 ? 'selecionado' : ''}`}
        onClick={invertido}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Invertido
      </div>

      {[5, 6, 7].map(num => (
        <div
          key={`dezena-cerc-${num}`}
          className={`cerca-box ${cercSelecionado === num ? 'selecionado' : ''}`}
          onClick={() => toggleCerc(num)}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        >
          Cerc.{num}
        </div>
      ))}
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
        {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
          <div
            key={num}
            className={`numero-box ${numerosSelecionados.includes(num) ? 'selecionado' : ''}`}
            onClick={() => toggleNumero(num)}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          >
            {num}
          </div>
        ))}
      </div>
      
      <div style={{ margin: '10px 0', textAlign: 'center' }}>
      <strong>Dígitos selecionados:</strong> {centenaNumerosSelecionados.join('')}
    </div>

    {/* Números 0 a 9 */}
    <div className="numeros-grid" style={{ justifyContent: 'center' }}>
      {Array.from({ length: 10 }, (_, i) => i).map(num => (
        <div
          key={`digito-${num}`}
          className="numero-box"
          onClick={() => toggleCentenaNumero(num)}
          style={{
            cursor: 'pointer',
            margin: '0 5px',
            backgroundColor: centenaNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num.toString().padStart(1, '0')}
        </div>
      ))}
    </div>

    {/* Mostrar dezenas formadas */}
    <div style={{ marginTop: '15px', textAlign: 'center' }}>
      <strong>Dezenas formadas:</strong> {centenaPalpites.map(d => d.toString().padStart(3, "0")).join(',')}
    </div>


  </div>
)}

{/* /Renderize os elementos da Milhar 4 */}
{grupoSelecionado === '4' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div
        className={`cerca-box ${globalInvertido === 1 ? 'selecionado' : ''}`}
        onClick={invertido}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Invertido
      </div>

      <div
        className={`cerca-box ${cercSelecionado === 5 ? 'selecionado' : ''}`}
        onClick={() => toggleCerc(5)}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Cerc.5
      </div>
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
        <div
          key={`milhar-numero-${num}`}
          className={`numero-box ${numerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Palpites adicionados */}
      {milharPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}

    
{/* Números 0 a 9 */}
<div className="numeros-grid" style={{ justifyContent: 'center' }}>
  {Array.from({ length: 10 }, (_, i) => i).map(num => (
    <div
      key={`digito-milhar-${num}`}
      className="numero-box"
      onClick={() => toggleMilharNumero(num)}
      style={{
        cursor: 'pointer',
        margin: '0 5px',
        backgroundColor: milharNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {num}
    </div>
  ))}
</div>

{/* Mostrar milhares formados */}
<div style={{ marginTop: '15px', textAlign: 'center' }}>
  <strong>Milhares formados:</strong> {milharPalpites.join(',')}
</div>

  </div>
)}

{/* /Renderize os elementos da Duque de Grupo 5 */}
{grupoSelecionado === '5' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarDuqueGrupoAleatorio}
      >
        +
      </div>
      {duqueGrupoPalpites.map((num, idx) => (
        <div
          key={`duque-grupo-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num.toString().padStart(2, '0')}
        </div>
      ))}
    </div>

    <div
      className="numeros-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gap: '8px',
        justifyContent: 'center'
      }}
    >
      {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
        <div
          key={`duque-grupo-${num}`}
          className={`numero-box ${duqueGrupoPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleDuqueGrupoNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: duqueGrupoPalpites.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Duque de Dezena 6*/}
{grupoSelecionado === '6' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      {/* Botão "+" */}
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarDuqueDezenaAleatorio}
      >
        +
      </div>

      {/* Palpites adicionados */}
      {duqueDezenaPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Números 0 a 9 */}
<div className="numeros-grid" style={{ justifyContent: 'center' }}>
  {Array.from({ length: 10 }, (_, i) => i).map(num => (
    <div
      key={`digito-milhar-${num}`}
      className="numero-box"
      onClick={() => toggleDuqueDezenaNumero(num)}
      style={{
        
        cursor: 'pointer',
        margin: '0 5px',
        backgroundColor: duqueDezenaNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {num}
    </div>
  ))}
</div>

</div>
)}

{/* /Renderize os elementos da Terno de Dezena 7 */}
{grupoSelecionado === '7' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      {/* Botão "+" */}
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarDuqueDezenaAleatorio}
      >
        +
      </div>

      {/* Palpites adicionados */}
      {ternoDezenaPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Números 0 a 9 */}
<div className="numeros-grid" style={{ justifyContent: 'center' }}>
  {Array.from({ length: 10 }, (_, i) => i).map(num => (
    <div
      key={`digito-milhar-${num}`}
      className="numero-box"
      onClick={() => toggleTernoDezenaNumero(num)}
      style={{
        
        cursor: 'pointer',
        margin: '0 5px',
        backgroundColor: ternoDezenaNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {num}
    </div>
  ))}
</div>

</div>
)}

{/* /Renderize os elementos da Terno de Grupo 8 */}
{grupoSelecionado === '8' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      {/* Botão "+" */}
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarTernoGrupoAleatorio}
      >
        +
      </div>

      {/* Palpites adicionados */}
      {ternoGrupoPalpites.map((num, idx) => (
        <div
          key={`terno-grupo-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num.toString().padStart(2, '0')}
        </div>
      ))}
    </div>

    {/* Números de 01 a 25 */}
    <div
      className="numeros-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gap: '8px',
        justifyContent: 'center'
      }}
    >
      {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
        <div
          key={`terno-grupo-${num}`}
          className={`numero-box ${ternoGrupoPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleTernoGrupoNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: ternoGrupoPalpites.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num.toString().padStart(2, '0')}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Milhar e Centena 9 */}
{grupoSelecionado === '9' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div
        className={`cerca-box ${globalInvertido === 1 ? 'selecionado' : ''}`}
        onClick={invertido}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Invertido
      </div>

      <div
        className={`cerca-box ${cercSelecionado === 5 ? 'selecionado' : ''}`}
        onClick={() => toggleCerc(5)}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Cerc.5
      </div>
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
        <div
          key={`milhar-numero-${num}`}
          className={`numero-box ${numerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Palpites adicionados */}
      {milharCentenaPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}

    
{/* Números 0 a 9 */}
<div className="numeros-grid" style={{ justifyContent: 'center' }}>
  {Array.from({ length: 10 }, (_, i) => i).map(num => (
    <div
      key={`digito-milhar-${num}`}
      className="numero-box"
      onClick={() => toggleMilharCentenaNumero(num)}
      style={{
        cursor: 'pointer',
        margin: '0 5px',
        backgroundColor: milharCentenaNumerosSelecionados.includes(num) ? '#3399ff' : '#4CAF50',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {num}
    </div>
  ))}
</div>

{/* Mostrar milhares formados */}
<div style={{ marginTop: '15px', textAlign: 'center' }}>
  <strong>Milhares formados:</strong> {milharCentenaPalpites.join(',')}
</div>

  </div>
)}

{/* /Renderize os elementos da Dezeninha 10 */}
{grupoSelecionado === '10' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    {/* Botões de modalidade */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '12px' }}>
      {['Terno', 'Quadra', 'Quina'].map(mod => (
        <div
          key={mod}
          className={`cerca-box ${dezenaModalidade === mod ? 'selecionado' : ''}`}
          onClick={() => setDezenaModalidade(dezenaModalidade === mod ? null : mod)}
          style={{ cursor: 'pointer' }}
        >
          {mod}
        </div>
      ))}
    </div>

    <h3>Meus palpites</h3>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarDezeninhaAleatorio}
      >
        +
      </div>
      {dezeninhaPalpites.map((num, idx) => (
        <div
          key={`dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}
    </div>

    <div
      className="numeros-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gap: '8px',
        justifyContent: 'center'
      }}
    >
      {Array.from({ length: 10 }, (_, i) => i).map(num => (
        <div
          key={`dezena-${num}`}
          className={`numero-box ${dezeninhaPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleDezeninhaNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: dezenaDezenaPalpites.includes(num) ? '#3399ff' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
)}



 {/* Botão para finalizar a aposta */}
 <CurrencyInput
  id="input-valor"
  name="valor"
  placeholder="R$ 0,00"
  decimalsLimit={2}
  decimalSeparator=","
  groupSeparator="."
  prefix="R$ "
  value={valor}
  onValueChange={(value) => setValor(value)}
/>

      <button 
        onClick={handleFinalizar}
        style={{
          padding: '10px 20px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          fontWeight: 'bold', 
          border: 'none', 
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Finalizar Aposta
      </button>
      <button onClick={adicionarPalpite}>Adicionar Palpite</button>

      
      
      {/* Aqui começa o modal */}
      {showModal && (
        
      <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>Resumo da Aposta</h2>
            <div>
              <p><strong>DATA:</strong> {dataSelecionado}</p>
              <p><strong>HORÁRIO:</strong> {horarioSelecionado}</p>
              <p><strong>PALPITES:</strong></p>
              <ul>
                {palpitesSalvos.map((p, i) => (
                  <li key={i}>
                    {nomesDosGrupos[p.grupo] || `Grupo ${p.grupo}`} - {p.palpite} - R$ {p.valor.toFixed(2)} 
                  </li>
                ))}
              </ul>
              <p><strong>TOTAL:</strong> R$ {somaTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                alert('Aposta finalizada com sucesso!');
                setShowModal(false);
                handleFinalizarAposta();
                setPalpitesSalvos([]);
              }}
              style={confirmButtonStyle}
            >
              Confirmar Aposta
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={cancelButtonStyle}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

</div>

      
       { <div>
        
        <button onClick={selecionarImpressora}>🔌 Selecionar Impressora</button>
      </div> }

      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{printerStatus}</p>

      {mensagem && <p className="mensagem">{mensagem}</p>} 
<div>
  <h3>Palpites Salvos</h3>
  <ul>
    {palpitesSalvos.map(p => (
  <div key={p.id}>
    <span>{nomesDosGrupos[p.grupo] || `Grupo ${p.grupo}`} - {p.palpite} - R$ {p.valor}</span>
    <button onClick={() => removerPalpite(p.id)}>Excluir</button>
  </div>
))}

  </ul>
  
</div>


    
      
{        /*   <img src="./Pixmaquina.png" alt="Bicho logo" className="logo-canto" /> */}
    </div>
  );
}

// Estilo para o fundo do modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

// Estilo para o conteúdo do modal
const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '300px',
  textAlign: 'center',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

// Estilo para o botão de confirmação
const confirmButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  margin: '10px',
  borderRadius: '5px',
};

// Estilo para o botão de cancelamento
const cancelButtonStyle = {
  backgroundColor: '#ccc',
  color: 'black',
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  margin: '10px',
  borderRadius: '5px',
};


export default App;
