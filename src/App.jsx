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
  const [selecionado1, setSelecionado1] = useState(false);
const [selecionado2, setSelecionado2] = useState(false);
const [selecionado3, setSelecionado3] = useState(false);
const [selecionado4, setSelecionado4] = useState(false);
const [selecionado5, setSelecionado5] = useState(false);
const [selecionado6, setSelecionado6] = useState(false);
const [selecionado7, setSelecionado7] = useState(false);
const [selecionado8, setSelecionado8] = useState(false);
const [selecionado9, setSelecionado9] = useState(false);
const [selecionado10, setSelecionado10] = useState(false);
const [selecionado11, setSelecionado11] = useState(false);
const [selecionado12, setSelecionado12] = useState(false);
const [mostrarCercas, setMostrarCercas] = useState(false);
const [numerosSelecionados, setNumerosSelecionados] = useState([]);
const [cercSelecionado, setCercSelecionado] = useState(null);

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

  // ==== INÍCIO DA ALTERAÇÃO: limpar cercas e números quando grupo for desmarcado =====
  useEffect(() => {
    if (!selecionado1) {
      setCercSelecionado(null);
      setNumerosSelecionados([]);
    }
  }, [selecionado1]);
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
    className={`grupo-box ${selecionado1 ? 'selecionado' : ''}`}
  onClick={() => {
    setSelecionado1(!selecionado1);
    setMostrarCercas(!mostrarCercas);
  }}
  >
    Grupo
  </div>
  <div
    className={`grupo-box ${selecionado2 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado2(!selecionado2)}
  >
    Dezena
  </div>
  <div
    className={`grupo-box ${selecionado3 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado3(!selecionado3)}
  >
    Centena
  </div>
  <div
    className={`grupo-box ${selecionado4 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado4(!selecionado4)}
  >
    Milhar
  </div>
  <div
    className={`grupo-box ${selecionado5 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado5(!selecionado5)}
  >
    Duque de Grupo
  </div>
  <div
    className={`grupo-box ${selecionado6 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado6(!selecionado6)}
  >
    Duque de Dezena
  </div>
  <div
    className={`grupo-box ${selecionado7 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado7(!selecionado7)}
  >
    Terno de Dezena
  </div>
  <div
    className={`grupo-box ${selecionado8 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado8(!selecionado8)}
  >
    Terno de Grupo
  </div>
  <div
    className={`grupo-box ${selecionado9 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado9(!selecionado9)}
  >
    Milhar e Centena
  </div>
  <div
    className={`grupo-box ${selecionado10 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado10(!selecionado10)}
  >
    Dezeninha
  </div>
  <div
    className={`grupo-box ${selecionado11 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado11(!selecionado11)}
  >
    Duque de Dez. DME
  </div>
  <div
    className={`grupo-box ${selecionado12 ? 'selecionado' : ''}`}
    onClick={() => setSelecionado12(!selecionado12)}
  >
    Terno de Dez.DME
  </div>
  

</div>

  {/* ==== INÍCIO DA ALTERAÇÃO: mostrar cercas e números só se Grupo estiver selecionado ==== */}
     <div className="cercamento-reservado">
  {selecionado1 && (
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
</div>

      {/* ==== FIM DA ALTERAÇÃO ==== */}

      



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

      
            <img src="./public/Pixmaquina.png" alt="Bicho logo" className="logo-canto" />

    </div>
  );
}

export default App;
