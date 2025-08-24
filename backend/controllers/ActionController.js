import Action from '../models/Action.js'
import Client from '../models/Client.js'

class ActionController{

    async store(req, res){

        const { descricao, client } = req.body
        const { user } = req.userId

        const client_id = await Client.findOne({ _id: client })

        if(!client_id){
            return res.json({ error: "Client não encontrado, por favor digite um ID válido!"})
        }

        try {
            const action = await Action.create({ descricao, client, user})

            return res.status(200).json({ action})
        } catch (err){
            return res.status(400).json({ error: "Erro ao adicionar nova ação!"})
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

        const { clientId } = req.params
        

        try {
            const actions = await Action.find({ client: clientId}).populate('client')
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