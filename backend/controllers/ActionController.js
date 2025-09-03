import { createAction } from '../models/Action.js'
import { showActions } from '../models/Action.js'
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

        const { user } = req.userId
        const { grupo, descricao } = req.body

        const clients = await Client.find({ grupoEconomico: grupo})

        const actions = await Promise.all(
            clients.map(client =>
                Action.create({ descricao, client: client._id, user})
            )
        )

        return res.json({actions})

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
 try {
        const { grupo } = req.params


        const clients = await Client.find({ grupoEconomico: grupo})
 

        const clientsId = clients.map(client => client._id )
    

       
            const actions = await Action.find({ client: {$in: clientsId} }).populate('client')

            const uniqueActionsMap = new Map()

        actions.forEach(action => {
             if (!uniqueActionsMap.has(action.descricao)) {
            uniqueActionsMap.set(action.descricao, action)
        }
     })

            const uniqueActions = Array.from(uniqueActionsMap.values())
          
            return res.json({actions: uniqueActions})
        } catch (err){
            return res.status(400).json({ error: "Erro ao buscar actions do cliente!"})
        }
        
    }

    async show(req, res){

        const { user } = req.userId
        
        const actions = await Action.find({ user: user }).populate('client')

        return res.json({ actions })

    }

    
}

export default new ActionController()