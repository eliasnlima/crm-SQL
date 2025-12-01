import { API_URL } from "../../backend/config/api.js";

const listaUsuarios = document.getElementById("users");
const inputBusca = document.getElementById("search-user");
const btnAtualizar = document.getElementById("atualizar-btn");
const resultMsg = document.getElementById("result");

async function carregarUsuarios() {
  resultMsg.textContent = "Carregando...";
  listaUsuarios.innerHTML = "";

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      resultMsg.textContent = data.error || "Erro ao carregar usuários";
      return;
    }

    if (data.users.length === 0) {
      resultMsg.textContent = "Nenhum vendedor encontrado.";
      return;
    }

    resultMsg.textContent = "";

    data.users.forEach(user => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="user-dashboard.html?id=${user.id}&name=${encodeURIComponent(user.name)}">
          <div class="user-info">
            <span class="user-name">${user.name}</span>
            <span class="user-email">Função: ${user.role}</span>
          </div>
        </a>
      `;
      listaUsuarios.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    resultMsg.textContent = "Erro de conexão com o servidor.";
  }
}

document.addEventListener("DOMContentLoaded", carregarUsuarios);