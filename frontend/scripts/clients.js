import { API_URL } from "../../backend/config/api.js";

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')

    if(!token){
        document.getElementById('result').innerHTML = "Usuario não autenticado, faça login!"
        return;
    }

    showClients(token)
    importClient(token)

})

let todosClients = []

async function showClients(token){
    
    try{
    const res = await fetch(`${API_URL}/clients`, {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        },
    })

    const dataClients = await res.json()

    if(!res.ok){
        const messageErro = dataClients.error || 'Erro no servidor!';
        document.getElementById('result').innerHTML = messageErro
        return
    }

        todosClients = dataClients.clients
        renderClients(todosClients)

    } catch (err){
        document.getElementById('result').innerHTML = "erro no servidor!"
    }

    

}

function renderClients(todosClients) {

    const div = document.getElementById('clients')
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

        li.innerHTML = `<a href="detalhes.html?grupo=${grupoCodigo}"><div class="info">G.E: ${grupoCodigo} - ${nomeGrupo} - ${membros.length} clientes</div> <div class="agendamento">📅 ${proxint}</div></a>`
        div.appendChild(li)
    })


    semGrupo.forEach(client => {
         const dataAgendada = client.prox_int
            ? new Date(client.prox_int).toLocaleDateString("pt-BR")
            : "Sem agendamento";

        const li = document.createElement("li")
        li.innerHTML = `<a href="detalhes.html?id=${client.id}">
            <div class="info">
                ${client.codigo} - ${client.nome}
                <span class="data">CNPJ: ${formatarCNPJ(client.cnpj)} - ${formatarTelefone(client.fone)} - ${client.email}</span>
            </div>
            <div class="agendamento">📅 ${dataAgendada}</div>
        </a>`;
        div.appendChild(li);
  });

  
}

const modal = document.getElementById('modal')
const abrirModal = document.getElementById('add-client-btn')
const fecharModal = document.getElementById('fechar-btn')
const cadastrarBtn = document.getElementById('cadastrar-btn')

abrirModal.addEventListener('click', () => {
    modal.style.display = "flex"
})

fecharModal.addEventListener('click', () => {
    modal.style.display = "none"
})

cadastrarBtn.addEventListener('click', async () => {

    const nome = document.getElementById('nome').value 
    const cnpj = document.getElementById('cnpj').value 
    const fone = document.getElementById('fone').value 
    const email = document.getElementById('email').value 

    const token = localStorage.getItem('token')
    const msg = document.getElementById('modal-msg')

    if(!nome || !cnpj){
        msg.innerText = "Preencha todos os campos!"
    }

    try{

        const res = await fetch(`${API_URL}/client`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'authorization' : 'Bearer ' + token
            },
            body: JSON.stringify({nome, cnpj, fone, email})
        })

        const data = await res.json()

        if(res.ok){

            modal.style.display = "none"
            document.getElementById('nome').value = ""
            document.getElementById('cnpj').value = ""
            document.getElementById('fone').value = ""
            document.getElementById('email').value = ""
            showClients(token)

        }else {
            msg.innerText = "Erro ao cadastrar cliente!"
        }



    }catch (err){
        msg.innerText = "Erro no SERVIDOR ao cadastrar cliente!"
    }
})

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

document.getElementById('search-client').addEventListener('input', (e) => {
    const termo = e.target.value.trim().replace(/\s+/g, ' ').toLowerCase();

    if (termo === "") {
        renderClients(todosClients);
        return;
    }

  
    const filtrados = todosClients.filter(cliente => {
    const nome = cliente.nome ? String(cliente.nome).toLowerCase() : "";
    const codigo = cliente.codigo ? String(cliente.codigo).toLowerCase() : "";
    return nome.includes(termo) || codigo.includes(termo);
});

        renderClients(filtrados);
   
});

function renderGroup(grupoCodigo) {
    const div = document.getElementById('clients');
    div.innerHTML = "";  


    const li = document.createElement("li");
     const nomeGrupo = grupoCodigo[0]?.nome
    li.innerHTML = `
        <a href="detalhes.html?grupo=${grupoCodigo}">
            G.E: ${grupoCodigo} - ${nomeGrupo}
        </a>
    `;
    div.appendChild(li);
}


document.getElementById('abrir-resumo-btn').addEventListener('click', () => {
  const fasesContagem = contarPorFase(todosClients)
  renderizarTabelaFases(fasesContagem)
  document.getElementById('modal-resumo').style.display = 'flex'
})

document.getElementById('fechar-resumo-btn').addEventListener('click', () => {
  document.getElementById('modal-resumo').style.display = 'none'
})

function contarPorFase(clientes) {
  const contagem = {}
  const grupoContados = new Set()

  clientes.forEach(cliente => {
    const grupo = cliente.grupo_codigo
    const fase = cliente.status || 'Não definido'

    if(grupo) {
      if (grupoContados.has(grupo)) return
      grupoContados.add(grupo)
    }

    contagem[fase] = (contagem[fase] || 0) + 1
  })

  return contagem
}

function renderizarTabelaFases(fases) {
  const tbody = document.querySelector('#tabela-fases tbody')
  tbody.innerHTML = ''

  Object.entries(fases).forEach(([fase, quantidade]) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${fase}</td><td>${quantidade}</td>`
    tbody.appendChild(tr)
  })
}

document.getElementById('filtro-data').addEventListener('change', (e) => {
    const agendado = e.target.value

    const filtrados = todosClients.filter(cliente => {

       const dataCliente = new Date(cliente.prox_int).toISOString().split('T')[0];

        return dataCliente === agendado;

    })

    renderClients(filtrados)
})

document.getElementById('filtro-status').addEventListener('change', (e) => {
    const status = e.target.value

    if(!status){
      renderClients(todosClients)
      return;
    }

    const filtrados = todosClients.filter(cliente => {

      return cliente.status === status;
    })

    renderClients(filtrados)
})

async function importClient(token) {
    
    document.getElementById('importForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const response = await fetch(`${API_URL}/import-clients`, {
      method: 'POST',
      headers: {
        'authorization' : 'Bearer ' + token
      },
      body: formData
    })

    const result = await response.json()
    alert(result.message || 'Erro ao importar')
  })
}