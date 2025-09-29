import pool from '../config/db.js'
import { showActionQtd } from '../models/admin-action.js'


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

    
    
}

export default new AdminController()