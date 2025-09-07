import { createAction } from '../models/Action.js'
import { showActions } from '../models/Action.js'
import { createActionGroup } from '../models/Action.js'
import { showActionsGroup } from '../models/Action.js'
import pool from '../config/db.js'



class ActionController{

    async store(req, res){

        const { descricao, client_id } = req.body
        const  user_id  = req.userId

        try {

            const checkClient = await pool.query('SELECT * FROM clients WHERE id = $1', [client_id])
            if(checkClient.rows.length === 0)
             return res.status(404).json({ error: "Cliente não encontrado!"})

            const actionData = {
                descricao,
                client_id,
                user_id
            }

            const action = await createAction(actionData)

            return res.status(200).json({ action })
        } catch (err){
            return res.status(400).json({ error: "Erro ao criar ação!"})
        }
    }

    async storeG (req, res){
        
        const  user_id  = req.userId
        const { descricao } = req.body
        const { grupo } = req.params

        const action = {
            user_id,
            descricao
        }

        const data = await createActionGroup(action, grupo)

        return res.json({data})

    }

    async index(req, res){

        const { id } = req.params
        

        try {
            const actions = await showActions(id)
            return res.json({actions})
        } catch (err){
            return res.status(400).json({ error: "Erro ao buscar actions do cliente!"})
        }
        
    }

    async indexGrupo(req, res){

        const { grupo } = req.params

        const action = await showActionsGroup(grupo)

        return res.json({action})
    }

    async show(req, res){

        const { user } = req.userId
        
        const actions = await Action.find({ user: user }).populate('client')

        return res.json({ actions })

    }

    
}

export default new ActionController()