   import { API_URL } from "../config/api.js";

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token')
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('id')
    const userNome = urlParams.get('name')

   if (!token || (!userId)) {
        document.getElementById('vendedor-nome').innerHTML = "Erro ao buscar vendedor!"
        return
    }
   
    document.getElementById('vendedor-nome').innerHTML = `Vendedor: ` + userNome

    document.getElementById('data').addEventListener('change', () => {
    const selectedDate = document.getElementById('data').value;
    if (selectedDate) {
      carregaUser(userId, token);
    }
  });

  document.getElementById('btn-filtrar').addEventListener('click', () => {
  filtrarSemAcoes(userId, token) 
})

document.getElementById('btn-todos-clientes').addEventListener('click', () => {
      window.location.href = `clients-user.html?id=${userId}&name=${encodeURIComponent(userNome)}`
})
   
})

async function carregaUser(id, token) {

    
    
    const filtro = document.getElementById('data').value

    try{
        const res = await fetch(`${API_URL}/admin/user/${id}`, {
            method: 'POST',
            headers:{
                'authorization' : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ date: filtro })

        })
        
        const data = await res.json()
        
        document.getElementById('qtd-clientes').innerHTML = data.qtd?.quantidade_de_acoes

    }catch (err){
        document.getElementById('result').innerHTML = err || "Erro ao filtrar quantidade de ações!"
    }


}

async function filtrarSemAcoes(id, token) {

  // Pega as duas datas selecionadas
  const inicio = document.getElementById('inicio').value
  const fim = document.getElementById('fim').value
  const resultBox = document.getElementById('result')
  const lista = document.getElementById('clientes-sem-acoes')

  // Limpa mensagens anteriores
  resultBox.innerHTML = ""
  lista.innerHTML = ""

  // Verifica se as duas datas foram preenchidas
  if (!inicio || !fim) {
    resultBox.innerHTML = "Por favor, selecione as duas datas."
    return
  }

  try {
    // Faz a requisição para o back-end
    const res = await fetch(`${API_URL}/admin/user/${id}/actionNull`, {
      method: 'POST',
      headers: {
        'authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inicio, fim })
    })

    const data = await res.json()
   

    // Se vier um erro
    if (!res.ok) {
      resultBox.innerHTML = data.error || "Erro ao buscar clientes sem ações."
      return
    }

    // Se não houver clientes
    if (!data.result || data.result.length === 0) {
      resultBox.innerHTML = "Nenhum cliente encontrado sem ações nesse período."
      return
    }

    // Exibe cada cliente na lista
    data.result.forEach(cli => {
      const li = document.createElement('li')
      li.textContent = `${cli.codigo} - ${cli.nome}` || `Cliente #${cli.id}`
      lista.appendChild(li)
    })

  } catch (err) {
    resultBox.innerHTML = "Erro ao buscar clientes sem ações."
  }
}