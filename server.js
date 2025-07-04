const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clientes = [];
let listaGlobal = [];

wss.on('connection', ws => {
  clientes.push(ws);

  // Envia lista para o novo cliente
  ws.send(JSON.stringify({ tipo: 'sync', lista: listaGlobal }));

  ws.on('message', msg => {
    console.log('Mensagem recebida:', msg);
    const data = JSON.parse(msg);

    if (data.tipo === 'add') {
      if (!listaGlobal.includes(data.nome)) {
        listaGlobal.push(data.nome);
      }
    } else if (data.tipo === 'remove') {
      listaGlobal = listaGlobal.filter(n => n !== data.nome);
    }
    const pacote = JSON.stringify({ tipo: 'sync', lista: listaGlobal });
    clientes.forEach(c => {
      if (c.readyState === WebSocket.OPEN) c.send(pacote);
    });
  });

  ws.on('close', () => {
    clientes = clientes.filter(c => c !== ws);
  });
});

console.log('WebSocket rodando em ws://localhost:8080');
