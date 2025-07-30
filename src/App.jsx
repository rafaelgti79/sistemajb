import { useState, useEffect } from 'react';
import EscPosEncoder from './utils/EscPosEncoder';
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
const [numerosSelecionados, setNumerosSelecionados] = useState([]);
const [cercSelecionado, setCercSelecionado] = useState(null);
const [dezenaNumerosSelecionados, setDezenaNumerosSelecionados] = useState([]);
const [dezenaCercSelecionado, setDezenaCercSelecionado] = useState(null);
const [centenaNumerosSelecionados, setCentenaNumerosSelecionados] = useState([]);
const [centenaCercSelecionado, setCentenaCercSelecionado] = useState(null);
const [centenaInvertido, setCentenaInvertido] = useState(false);
const [milharCercSelecionado, setMilharCercSelecionado] = useState(null);
const [milharNumerosSelecionados, setMilharNumerosSelecionados] = useState([]);
const [milharInvertido, setMilharInvertido] = useState(false);
const [duquePalpites, setDuquePalpites] = useState([]);
const [duqueDezenaPalpites, setDuqueDezenaPalpites] = useState([]);
const [ternoDezenaPalpites, setTernoDezenaPalpites] = useState([]);
const [ternoGrupoPalpites, setTernoGrupoPalpites] = useState([]);
const [mcInvertido, setMcInvertido] = useState(false);
const [mcCercSelecionado, setMcCercSelecionado] = useState(null);
const [mcNumerosSelecionados, setMcNumerosSelecionados] = useState([]);
const [dezenaModalidade, setDezenaModalidade] = useState(null); // pode ser "Terno", "Quadra", "Quina"
const [dezenaDezenaPalpites, setDezenaDezenaPalpites] = useState([]);
const [duqueDmePalpites, setDuqueDmePalpites] = useState([]);
const [ternoDmePalpites, setTernoDmePalpites] = useState([]);
const [duqueGrupoPalpites, setDuqueGrupoPalpites] = useState([]);





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

// Marcar/desmarcar números individualmente (1–7)
const toggleDezenaNumero = (num) => {
  if (dezenaNumerosSelecionados.includes(num)) {
    setDezenaNumerosSelecionados(dezenaNumerosSelecionados.filter(n => n !== num));
  } else {
    setDezenaNumerosSelecionados([...dezenaNumerosSelecionados, num]);
  }
};
//--------------------//----------------------//

// Cercas para Centena
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

// Cercas para Milhar
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

const toggleDuqueGrupoNumero = (num) => {
  if (duqueGrupoPalpites.includes(num)) {
    setDuqueGrupoPalpites(duqueGrupoPalpites.filter(n => n !== num));
  } else {
    setDuqueGrupoPalpites([...duqueGrupoPalpites, num]);
  }
};

//--------------------//----------------------//

const toggleMilharNumero = (num) => {
  if (milharNumerosSelecionados.includes(num)) {
    setMilharNumerosSelecionados(milharNumerosSelecionados.filter(n => n !== num));
  } else {
    setMilharNumerosSelecionados([...milharNumerosSelecionados, num]);
  }
};
//--------------------//----------------------//

// Seleção individual
const toggleCentenaNumero = (num) => {
  if (centenaNumerosSelecionados.includes(num)) {
    setCentenaNumerosSelecionados(centenaNumerosSelecionados.filter(n => n !== num));
  } else {
    setCentenaNumerosSelecionados([...centenaNumerosSelecionados, num]);
  }
};

const adicionarDuqueDezenaAleatorio = () => {
  if (duqueDezenaPalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10); // 0 a 9
  if (!duqueDezenaPalpites.includes(novo)) {
    setDuqueDezenaPalpites([...duqueDezenaPalpites, novo]);
  }
};
//--------------------//----------------------//

const toggleDuqueDezenaNumero = (num) => {
  if (duqueDezenaPalpites.includes(num)) {
    setDuqueDezenaPalpites(duqueDezenaPalpites.filter(n => n !== num));
  } else {
    setDuqueDezenaPalpites([...duqueDezenaPalpites, num]);
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
  if (ternoDezenaPalpites.includes(num)) {
    setTernoDezenaPalpites(ternoDezenaPalpites.filter(n => n !== num));
  } else {
    setTernoDezenaPalpites([...ternoDezenaPalpites, num]);
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
    setTernoGrupoPalpites(ternoGrupoPalpites.filter(n => n !== num));
  } else {
    setTernoGrupoPalpites([...ternoGrupoPalpites, num]);
  }
};
//--------------------//----------------------//

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
  if (dezenaDezenaPalpites.includes(num)) {
    setDezenaDezenaPalpites(dezenaDezenaPalpites.filter(n => n !== num));
  } else {
    setDezenaDezenaPalpites([...dezenaDezenaPalpites, num]);
  }
};
//--------------------//----------------------//

// Cercas para Duque de Dez. DME
const adicionarDuqueDmeAleatorio = () => {
  if (duqueDmePalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10);
  if (!duqueDmePalpites.includes(novo)) {
    setDuqueDmePalpites([...duqueDmePalpites, novo]);
  }
};

const toggleDuqueDmeNumero = (num) => {
  if (duqueDmePalpites.includes(num)) {
    setDuqueDmePalpites(duqueDmePalpites.filter(n => n !== num));
  } else {
    setDuqueDmePalpites([...duqueDmePalpites, num]);
  }
};
//--------------------//----------------------//

// Cercas para Terno de Dez. DME
const adicionarTernoDmeAleatorio = () => {
  if (ternoDmePalpites.length >= 10) return;
  const novo = Math.floor(Math.random() * 10);
  if (!ternoDmePalpites.includes(novo)) {
    setTernoDmePalpites([...ternoDmePalpites, novo]);
  }
};

const toggleTernoDmeNumero = (num) => {
  if (ternoDmePalpites.includes(num)) {
    setTernoDmePalpites(ternoDmePalpites.filter(n => n !== num));
  } else {
    setTernoDmePalpites([...ternoDmePalpites, num]);
  }
};
//--------------------//----------------------//


// ==== INÍCIO DA ALTERAÇÃO: função para alternar cercas =====
  const toggleCerc = (num) => {
    if (cercSelecionado === num) {
      // clicou no mesmo cerc, limpar seleção (desistiu)
      setCercSelecionado(null);
      setNumerosSelecionados([]);
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
    if (numerosSelecionados.includes(num)) {
      setNumerosSelecionados(numerosSelecionados.filter(n => n !== num));
    } else {
      setNumerosSelecionados([...numerosSelecionados, num]);
    }
  };
  // ==== FIM DA ALTERAÇÃO =====

 


const selecionarCercamento = (limite) => {
  const novosNumeros = Array.from({ length: limite }, (_, i) => i + 1);
  setNumerosSelecionados(novosNumeros);
};


  //função para mudar de cor quando clicar 
  const toggleSelecionado = (index) => {
  setSelecionados((prev) =>
    prev.includes(index)
      ? prev.filter((i) => i !== index)
      : [...prev, index]
  );
};


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'p') {
        setCredito((prev) => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const conectarImpressora = async () => {
      try {
        const ports = await navigator.serial.getPorts();
        if (ports.length === 0) {
          setPrinterStatus('❌ Nenhuma impressora detectada');
          return;
        }

        const port = ports[0];

        if (port.readable || port.writable) {
          setPortaSerial(port);
          setPrinterStatus('✅ Impressora já conectada');
          return;
        }

        if (!port.opened) {
          await port.open({ baudRate: 9600 });
          setPortaSerial(port);
          setPrinterStatus('✅ Impressora conectada automaticamente');
        }
      } catch (err) {
        console.warn('⚠️ Falha ao abrir porta serial:', err);
        setPrinterStatus('⚠️ Erro ao conectar automaticamente');
      }
    };

    conectarImpressora();

    const interval = setInterval(() => {
      if (!portaSerial || !portaSerial.readable) {
        conectarImpressora();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [portaSerial]);

  const selecionarImpressora = async () => {
    try {
      const port = await navigator.serial.requestPort();

      if (!port.opened) {
        await port.open({ baudRate: 9600 });
      }

      setPortaSerial(port);
      setPrinterStatus('✅ Impressora selecionada manualmente');
    } catch (err) {
      console.warn('Impressora não selecionada:', err);
      setPrinterStatus('❌ Impressora não selecionada');
    }
  };

  const sortear = () => Math.floor(Math.random() * 25);

  const apostar = () => {
    const grupoIndex = parseInt(grupo);
    const valorNum = parseInt(valor);

    if (isNaN(grupoIndex) || grupoIndex < 0 || grupoIndex > 24) {
      setMensagem('Escolha um grupo de 0 a 24.');
      return;
    }

    if (isNaN(valorNum) || valorNum <= 0) {
      setMensagem('Insira um valor válido.');
      return;
    }

    if (credito <= 0) {
      setMensagem('❌ Sem créditos! Aperte a tecla "P" para adicionar.');
      return;
    }

    if (valorNum > credito) {
      setMensagem('Crédito insuficiente para essa aposta.');
      return;
    }

    const resultado = sortear();
    const acertou = resultado === grupoIndex;
    const novoCredito = acertou ? credito + valorNum * 10 : credito - valorNum;

    setCredito(novoCredito);
    setMensagem(acertou
      ? `🎉 Você acertou! Sorteado: ${bichos[resultado]} (grupo ${resultado}). +${valorNum * 10} créditos!`
      : `❌ Errou! Sorteado: ${bichos[resultado]} (grupo ${resultado}). -${valorNum} crédito.`);

    setHistorico([
      ...historico,
      {
        grupo: grupoIndex,
        valor: valorNum,
        resultado,
        ganhou: acertou,
      }
    ]);

    setValor('');
    setGrupo('');
  };

  const imprimir = async () => {
    if (historico.length === 0) {
      alert("Nenhuma aposta para imprimir.");
      return;
    }

    try {
      let port = portaSerial;

      if (!port) {
        const ports = await navigator.serial.getPorts();
        if (ports.length === 0) {
          alert('Nenhuma impressora conectada. Clique em "Selecionar Impressora".');
          return;
        }
        port = ports[0];
        setPortaSerial(port);
        setPrinterStatus('✅ Impressora conectada automaticamente');
      }

      if (!port.readable || !port.writable) {
        if (!port.opened) {
          await port.open({ baudRate: 9600 });
        }
      }

     

      let encoder = new EscPosEncoder();
encoder = encoder.initialize().align('center').bold(true).line('🎰 Jogo do Bicho').bold(false);
encoder.line(`Créditos atuais: ${credito}`).newline();

encoder.line('Histórico de Apostas:');
historico.forEach((item, index) => {
  encoder
    .line(`Aposta ${index + 1}`)
    .line(`Grupo: ${item.grupo} - ${bichos[item.grupo]}`)
    .line(`Valor: ${item.valor}`)
    //.line(`Sorteado: ${item.resultado} - ${bichos[item.resultado]}`)
    //.line(item.ganhou ? '✅ Ganhou' : '❌ Perdeu')
    .newline();
});

encoder.cut('full');

const result = encoder.encode();


      const writer = port.writable.getWriter();
      await writer.write(result);
      writer.releaseLock();

      alert('🖨️ Impressão enviada com sucesso!');
    } catch (error) {
      console.error('Erro na impressão:', error);
      alert('Erro ao imprimir: ' + error.message);
    }
  };

  return (
    <div className="container">

      <div className="topo-container">
   <div className="saldo-box">Saldo R$: {credito}</div> {/* 🪙 Agora fixo no topo */}
  <h1 className="titulo-fixo">Jogo do Bicho</h1>

</div>

      
<div className="grupo-grid">
  <div
  className={`grupo-box ${grupoSelecionado === 'grupo' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'grupo' ? null : 'grupo')}
  >
  Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'dezena' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'dezena' ? null : 'dezena')}
  >
  Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'centena' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'centena' ? null : 'centena')}
  >
  Centena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'milhar' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'milhar' ? null : 'milhar')}
  >
  Milhar
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'duque de grupo' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'duque de grupo' ? null : 'duque de grupo')}
  >
  Duque de Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'duque de dezena' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'duque de dezena' ? null : 'duque de dezena')}
  >
  Duque de Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'terno de dezena' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'terno de dezena' ? null : 'terno de dezena')}
  >
  Terno de Dezena
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'terno de grupo' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'terno de grupo' ? null : 'terno de grupo')}
  >
  Terno de Grupo
  </div>

  <div
  className={`grupo-box ${grupoSelecionado === 'milhar e centena' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'milhar e centena' ? null : 'milhar e centena')}
  >
  Milhar e Centena
  </div>
  
  <div
  className={`grupo-box ${grupoSelecionado === 'dezeninha' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'dezeninha' ? null : 'dezeninha')}
  >
  Dezeninha
  </div>
  
  <div
  className={`grupo-box ${grupoSelecionado === 'duque de dez. dme' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'duque de dez. dme' ? null : 'duque de dez. dme')}
  >
  Duque de Dez. DME
  </div>
  
 <div
  className={`grupo-box ${grupoSelecionado === 'terno de dez. dme' ? 'selecionado' : ''}`}
  onClick={() => setGrupoSelecionado(grupoSelecionado === 'terno de dez. dme' ? null : 'terno de dez. dme')}
  >
  Terno de Dez.DME
  </div>
  

</div>

  {/* ==== INÍCIO DA ALTERAÇÃO: mostrar cercas e números só se Grupo estiver selecionado ==== */}
     <div className="cercamento-reservado">

  {/* /Renderize os elementos do Grupo 1 */}    
  {grupoSelecionado === 'grupo' && (
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
    </>
  )}

  {/* /Renderize os elementos da Dezena 2 */}
  {grupoSelecionado === 'dezena' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center' }}>
      {[5, 6, 7].map(num => (
        <div
          key={`dezena-cerc-${num}`}
          className={`cerca-box ${dezenaCercSelecionado === num ? 'selecionado' : ''}`}
          onClick={() => toggleDezenaCerc(num)}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        >
          Cerc.{num}
        </div>
      ))}
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
        <div
          key={`dezena-numero-${num}`}
          className={`numero-box ${dezenaNumerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleDezenaNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Centena 3 */}
{grupoSelecionado === 'centena' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div
        className={`cerca-box ${centenaInvertido ? 'selecionado' : ''}`}
        onClick={() => setCentenaInvertido(!centenaInvertido)}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Invertido
      </div>

      {[5, 6, 7].map(num => (
        <div
          key={`centena-cerc-${num}`}
          className={`cerca-box ${centenaCercSelecionado === num ? 'selecionado' : ''}`}
          onClick={() => toggleCentenaCerc(num)}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        >
          Cerc.{num}
        </div>
      ))}
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
        <div
          key={`centena-numero-${num}`}
          className={`numero-box ${centenaNumerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleCentenaNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Milhar 4 */}
{grupoSelecionado === 'milhar' && (
  <div className="cercamento-reservado">
    <div className="cercas-grid" style={{ marginTop: '15px', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div
        className={`cerca-box ${milharInvertido ? 'selecionado' : ''}`}
        onClick={() => setMilharInvertido(!milharInvertido)}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Invertido
      </div>

      <div
        className={`cerca-box ${milharCercSelecionado === 5 ? 'selecionado' : ''}`}
        onClick={() => toggleMilharCerc(5)}
        style={{ cursor: 'pointer', margin: '0 10px' }}
      >
        Cerc.5
      </div>
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
        <div
          key={`milhar-numero-${num}`}
          className={`numero-box ${milharNumerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleMilharNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Duque de Grupo 5 */}
{grupoSelecionado === 'duque de grupo' && (
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
{grupoSelecionado === 'duque de dezena' && (
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

    {/* Números de 0 a 9 */}
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
          key={`duque-dezena-${num}`}
          className={`numero-box ${duqueDezenaPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleDuqueDezenaNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: duqueDezenaPalpites.includes(num) ? '#3399ff' : '#4CAF50',
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
{grupoSelecionado === 'terno de dezena' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      {/* Botão "+" */}
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarTernoDezenaAleatorio}
      >
        +
      </div>

      {/* Palpites adicionados */}
      {ternoDezenaPalpites.map((num, idx) => (
        <div
          key={`terno-dezena-palpite-${idx}`}
          className="cerca-box"
          style={{ backgroundColor: '#3399ff', color: 'white' }}
        >
          {num}
        </div>
      ))}
    </div>

    {/* Números de 0 a 9 */}
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
          key={`terno-dezena-${num}`}
          className={`numero-box ${ternoDezenaPalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleTernoDezenaNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: ternoDezenaPalpites.includes(num) ? '#3399ff' : '#4CAF50',
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
{grupoSelecionado === 'terno de grupo' && (
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
{grupoSelecionado === 'milhar e centena' && (
  <div className="cercamento-reservado" style={{ marginTop: '20px' }}>
    <div className="cercas-grid" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        className={`cerca-box ${mcInvertido ? 'selecionado' : ''}`}
        onClick={() => setMcInvertido(!mcInvertido)}
        style={{ marginRight: '15px' }}
      >
        Invertido
      </div>

      {[5, 12].map((num) => (
        <div
          key={num}
          className={`cerca-box ${mcCercSelecionado === num ? 'selecionado' : ''}`}
          onClick={() => toggleMcCerc(num)}
          style={{ margin: '0 8px', cursor: 'pointer' }}
        >
          Cerc.{num}
        </div>
      ))}
    </div>

    <div className="numeros-grid" style={{ marginTop: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
        <div
          key={num}
          className={`numero-box ${mcNumerosSelecionados.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleMcNumero(num)}
          style={{ cursor: 'pointer', margin: '0 5px' }}
        >
          {num}
        </div>
      ))}
    </div>
  </div>
)}

{/* /Renderize os elementos da Dezeninha 10 */}
{grupoSelecionado === 'dezeninha' && (
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
      {dezenaDezenaPalpites.map((num, idx) => (
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
          className={`numero-box ${dezenaDezenaPalpites.includes(num) ? 'selecionado' : ''}`}
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

{/* /Renderize os elementos da Duque de Dez. DME 11*/}
{grupoSelecionado === 'duque de dez. dme' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarDuqueDmeAleatorio}
      >
        +
      </div>
      {duqueDmePalpites.map((num, idx) => (
        <div
          key={`dme-palpite-${idx}`}
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
          key={`duque-dme-${num}`}
          className={`numero-box ${duqueDmePalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleDuqueDmeNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: duqueDmePalpites.includes(num) ? '#3399ff' : '#4CAF50',
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

{/* /Renderize os elementos da Terno de Dez. DME 12*/}
{grupoSelecionado === 'terno de dez. dme' && (
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <h3>Meus palpites</h3>

    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
      <div
        className="cerca-box"
        style={{ cursor: 'pointer', backgroundColor: '#ccc', fontWeight: 'bold' }}
        onClick={adicionarTernoDmeAleatorio}
      >
        +
      </div>
      {ternoDmePalpites.map((num, idx) => (
        <div
          key={`terno-dme-palpite-${idx}`}
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
          key={`terno-dme-${num}`}
          className={`numero-box ${ternoDmePalpites.includes(num) ? 'selecionado' : ''}`}
          onClick={() => toggleTernoDmeNumero(num)}
          style={{
            cursor: 'pointer',
            backgroundColor: ternoDmePalpites.includes(num) ? '#3399ff' : '#4CAF50',
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


</div>

      {/* ==== FIM DA ALTERAÇÃO ==== 

      



      <div className="form">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Grupo (0 a 24)"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        />
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Valor da aposta"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button onClick={apostar}>Apostar</button>

        */}
        <div>
        <button onClick={imprimir}>🖨️ Imprimir Aposta</button>
        <button onClick={selecionarImpressora}>🔌 Selecionar Impressora</button>
      </div>

      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{printerStatus}</p>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <h3>Histórico de Apostas</h3>
      <ul className="historico">
        {historico.map((item, i) => (
          <li key={i}>
            Grupo escolhido: {item.grupo} ({bichos[item.grupo]}) - Valor: {item.valor} - Resultado: {item.resultado} ({bichos[item.resultado]}) - {item.ganhou ? '✅ Ganhou' : '❌ Perdeu'}
          </li>
        ))}
      </ul>

      
{        /*   <img src="./Pixmaquina.png" alt="Bicho logo" className="logo-canto" /> */}
    </div>
  );
}

export default App;
