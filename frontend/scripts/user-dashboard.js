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
   
})

async function carregaUser(id, token) {

    
    
    const filtro = document.getElementById('data').value

    try{
        const res = await fetch(`http://localhost:3035/admin/user/${id}`, {
            method: 'POST',
            headers:{
                'authorization' : 'Bearer ' + token,
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ date: filtro })

        })
        
        const data = await res.json()
        
        document.getElementById('qtd-clientes').innerHTML = data.qtd?.quantidade_de_acoes

        console.log(data)
        



    }catch (err){
        document.getElementById('result').innerHTML = err || "Erro ao filtrar quantidade de ações!"
    }


}