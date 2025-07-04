const socket = new WebSocket('wss://site-para-o-volei.onrender.com');
let lista = [];

socket.onopen = () => {
  console.log("✅ Conectado ao servidor WebSocket!");
};

socket.onmessage = event => {
  const data = JSON.parse(event.data);

  if (data.tipo === 'sync') {
    lista = data.lista;
    localStorage.setItem('lista', JSON.stringify(lista));
    renderizar();
  }
};

socket.onclose = () => {
  console.log("❌ WebSocket desconectado.");
};

function renderizar() {
  const c = document.getElementById('lista');
  c.innerHTML = '';
  lista.forEach(nome => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <span>${nome}</span>
      <button onclick="remover('${nome}')">X</button>
    `;
    c.appendChild(div);
  });
}

function entrar() {
  const nome = document.getElementById('nome').value.trim();
  const idade = document.getElementById('idade').value.trim();

  if (nome && idade) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('main').classList.remove('hidden');
  } else {
    alert('Preencha nome e idade');
  }
}

function adicionar() {
  const nome = document.getElementById('nomeInput').value.trim();
  if (!nome) return;

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ tipo: 'add', nome }));
    document.getElementById('nomeInput').value = '';
  } else {
    console.error("❌ WebSocket não está aberto.");
  }
}

function remover(nome) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ tipo: 'remove', nome }));
  } else {
    console.error("❌ WebSocket não está aberto.");
  }
}

// Renderiza lista salva localmente ao carregar
renderizar();
