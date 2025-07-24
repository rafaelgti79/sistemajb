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
      <h1>🎰 Jogo do Bicho</h1>
      <h2>Saldo R$: {credito}</h2>
      <p>Aperte a tecla <strong>P</strong> para adicionar 1 crédito</p>

      <div className="form">
        <input
          type="number"
          placeholder="Grupo (0 a 24)"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        />
        <input
          type="number"
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

      <h3>Grupos do Jogo do Bicho</h3>
      <ul className="grupos">
        {bichos.map((bicho, index) => (
          <li key={index}>
            {index} - {bicho}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
