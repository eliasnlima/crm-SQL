   const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const editForm = document.getElementById('edit-client-form');
    const editNome = document.getElementById('edit-nome');
    const editCodigo = document.getElementById('edit-codigo');
    const editVendedor = document.getElementById('edit-vendedor');
    let currentClientId = null;

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('id')
    const userNome = urlParams.get('name')

 

    if (!token || (!userId)) {
        document.getElementById('vendedor-nome').innerHTML = "Erro ao buscar vendedor!"
        return
    }

    document.getElementById('btn-voltar').addEventListener('click', () => {
      window.location.href = `user-dashboard.html?id=${userId}&name=${encodeURIComponent(userNome)}`
})

    showClients(userId, token)
   
})

let todosClients = []

async function showClients(userId, token){
    
    try{
    const res = await fetch(`http://localhost:3035/admin/user/${userId}/clients`, { 
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        },
    })

    const dataClients = await res.json()

    if(!res.ok){
        const messageErro = dataClients.error || 'Erro no servidor!';
        document.getElementById('vendedor-nome').innerHTML = messageErro
        return
    }

        todosClients = dataClients.clients
        renderClients(todosClients, token)

    } catch (err){
        document.getElementById('vendedor-nome').innerHTML = err
    }

}

function renderClients(todosClients, token) {

    const div = document.getElementById('clients-list')
    div.innerHTML = ""
    
    const grupos = {};
    const semGrupo = [];

  todosClients.forEach(cliente => {
    if (cliente.grupo_codigo) {
      if (!grupos[cliente.grupo_codigo]) {
        grupos[cliente.grupo_codigo] = [];
      }
      grupos[cliente.grupo_codigo].push(cliente);
    } else {
      semGrupo.push(cliente);
    }
  });

   Object.entries(grupos).forEach(([grupoCodigo, membros]) => {
        const li = document.createElement("li")
        const nomeGrupo = membros[0]?.nome_grupo
        const proxint = membros[0]?.prox_int
        ? new Date(membros[0]?.prox_int).toLocaleDateString("pt-BR")
            : "Sem agendamento";

        li.innerHTML = `<div class="info">G.E: ${grupoCodigo} - ${nomeGrupo} - ${membros.length} clientes</div> <div class="agendamento"></div>`
        div.appendChild(li)
        li.addEventListener('click', () => openPopup({
              isGroup: true,
              nome: nomeGrupo,
              codigo: grupoCodigo,
              user_id: membros[0].user_id
        }, token));
    })


    semGrupo.forEach(client => {
         const dataAgendada = client.prox_int
            ? new Date(client.prox_int).toLocaleDateString("pt-BR")
            : "Sem agendamento";

        const li = document.createElement("li")
        li.innerHTML = `
            <div class="info">
                ${client.codigo} - ${client.nome}
                <span class="data">CNPJ: ${formatarCNPJ(client.cnpj)} - ${formatarTelefone(client.fone)} - ${client.email}</span>
            </div>
            <div class="agendamento"></div>
        `;
        div.appendChild(li);
        li.addEventListener('click', () => openPopup(client, token));
  }); 

    
}

function formatarCNPJ(cnpj) {
  const numeros = cnpj.replace(/\D/g, ''); 
  if (numeros.length !== 14) return cnpj; 
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function formatarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, ''); 
  if (numeros.length !== 11) return telefone; 
  return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

  async function openPopup(client, token) {
   const isGrupo = !!client.grupo_codigo; 

  if (isGrupo) {
    document.querySelector('.popup-content h2').textContent = "Editar Grupo Econômico";
    editNome.value = client.nome_grupo || "";
    editCodigo.value = client.grupo_codigo || "";
    

    editNome.disabled = true;
    editCodigo.disabled = true;
  } else {
    document.querySelector('.popup-content h2').textContent = "Editar Cliente";
    editNome.value = client.nome;
    editCodigo.value = client.codigo || "";

    editNome.disabled = false;
    editCodigo.disabled = false; // Código continua travado (como combinado)
  }

  currentClientId = client; // Mantém referência íntegra (grupo ou cliente)

  // carregar vendedores no select
  const res = await fetch(`http://localhost:3035/admin/users`, {
    headers: { authorization: 'Bearer ' + token }
  });
  const data = await res.json();

  editVendedor.innerHTML = "";
  data.users.forEach(u => {
    const option = document.createElement("option");
    option.value = u.id;
    option.textContent = u.name;
    if (u.id === client.user_id) option.selected = true;
    editVendedor.appendChild(option);
  });

  popup.style.display = "flex";
}

closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
  });
  
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newUserId = editVendedor.value;
  const token = localStorage.getItem("token");
  const isGrupo = currentClientId.grupo_codigo !== null;

  const grupo = document.getElementById('edit-codigo').value

    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('id')

  try {
    let url = "";
    let body = { user_id: newUserId };

    if (isGrupo) {
      url = `http://localhost:3035/admin/groups/${grupo}`;
      
    } else {
      url = `http://localhost:3035/admin/clients/${currentClientId.id}`;
      body.nome = editNome.value;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Erro ao atualizar.");
    popup.style.display = "none";
    showClients(userId, token); // recarrega lista
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações.");
  }
});