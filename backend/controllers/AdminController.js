import pool from '../config/db.js'
import { showActionQtd } from '../models/admin-action.js'
import { showActionNull } from '../models/admin-action.js';
import { showClients } from '../models/admin-action.js';
import { updateUserClient } from '../models/admin-action.js';
import { updateUserGroup } from '../models/admin-action.js';

class AdminController{

    async showActions(req, res){

        try {
      const { date } = req.body;       
      const { user_id } = req.params;   

      const qtd = await showActionQtd(date, user_id);

      return res.json({ qtd });
    } catch (err) {
      console.error("Erro ao buscar quantidade de ações:", err);
      return res.status(500).json({ error: "Erro no servidor" });
    }

    }

    async nullActions(req, res){
      
      const { user_id} = req.params
      const { inicio } = req.body
      const { fim } = req.body

      const result = await showActionNull(user_id, inicio, fim)

      return res.json({ result })

    }

    async showClients(req, res){

      const { user_id } = req.params

      const clients = await showClients(user_id)

      return res.json({ clients })

    }

    async userUpdate(req, res){

      const clientId = req.params.clientId;
      const { user_id } = req.body

      const newUser = await updateUserClient(user_id, clientId)

      return res.json({newUser})
      
    }

       async groupUpdate(req, res){

      const grupoCodigo = req.params.grupoCodigo;
      const { user_id } = req.body

      const newUser = await updateUserGroup(user_id, grupoCodigo)

      return res.json({newUser})
      
    }
    
    
}

export default new AdminController()