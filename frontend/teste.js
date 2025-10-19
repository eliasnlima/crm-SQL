document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  const userName = urlParams.get('name');
  const clientsList = document.getElementById('clients-list');
  const vendedorNome = document.getElementById('vendedor-nome');
  const popup = document.getElementById('popup');
  const closePopup = document.getElementById('close-popup');
  const editForm = document.getElementById('edit-client-form');
  const editNome = document.getElementById('edit-nome');
  const editCodigo = document.getElementById('edit-codigo');
  const editVendedor = document.getElementById('edit-vendedor');
  let currentClientId = null;

  // Atualiza título com nome do vendedor
  vendedorNome.textContent = `Clientes de ${userName}`;

  // Botão voltar
  document.getElementById('btn-voltar').addEventListener('click', () => {
    window.history.back();
  });

  // Função para carregar clientes do vendedor
  async function loadClients() {
    try {
      const res = await fetch(`http://localhost:3035/admin/user/${userId}/clients`);
      const data = await res.json();
      clientsList.innerHTML = '';

      data.clients.forEach(client => {
        const card = document.createElement('div');
        card.classList.add('client-card');
        card.innerHTML = `
          <p><strong>Nome:</strong> ${client.nome}</p>
          <p><strong>Código:</strong> ${client.codigo || '-'}</p>
        `;

        card.addEventListener('click', () => openPopup(client));
        clientsList.appendChild(card);
      });

    } catch (err) {
      clientsList.innerHTML = `<p class="message">Erro ao carregar clientes!</p>`;
      console.error(err);
    }
  }

  // Função para abrir popup
  async function openPopup(client) {
    currentClientId = client.id;
    editNome.value = client.nome;
    editCodigo.value = client.codigo || '';

    // Carregar lista de vendedores no select
    try {
      const res = await fetch(`http://localhost:3035/admin/users`);
      const usersData = await res.json();
      editVendedor.innerHTML = '';
      usersData.users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        if (user.id === client.user_id) option.selected = true;
        editVendedor.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar vendedores:', err);
    }

    popup.style.display = 'flex';
  }

  // Fechar popup
  closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Atualizar cliente
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const body = {
        nome: editNome.value,
        user_id: parseInt(editVendedor.value)
      };

      const res = await fetch(`http://localhost:3035/admin/clients/${currentClientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Erro ao atualizar cliente');

      popup.style.display = 'none';
      loadClients();

    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });

  // Inicializa lista
  loadClients();
});




async function openPopup(client, token) {

    if(client.grupo_codigo != null){
      editNome.value = nomeGrupo;
      editCodigo.value = client.grupo_codigo || '';

    } else {
       editNome.value = client.nome;
       editCodigo.value = client.codigo || '';
    }
    
    currentClientId = client.id;
   
    
    // Carregar lista de vendedores no select
    try {
      const res = await fetch(`http://localhost:3035/admin/users`, {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        },

      });
      const usersData = await res.json();
      editVendedor.innerHTML = '';
      usersData.users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        if (user.id === client.user_id) option.selected = true;
        editVendedor.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar vendedores:', err);
    }

    popup.style.display = 'flex';
  }
