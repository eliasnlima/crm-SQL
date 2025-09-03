import { create } from "../models/Client.js"
import { showClients } from "../models/Client.js"
import { showClientIndex } from "../models/Client.js"
import { updateStatus } from "../models/Client.js"
import { proxIntClient } from "../models/Client.js"

class ClientController{

    async show(req, res){

        const user_id = req.userId

        const clients = await showClients(user_id)

        return res.json({clients})

    }

    async store(req, res){
        
        try {
            const { nome, cnpj, fone, email } = req.body

            const clientData = {
                nome,
                cnpj,
                user_id: req.userId,
                fone,
                email
            }

            const newClient = await create(clientData)

            return res.status(201).json({ message: "Cliente cadastrado com sucesso", newClient})

        } catch (err){
            console.error('Erro ao cadastrar cliente!', err)
        }
        
    }

    async index(req, res){
        
        const { id } = req.params
        
        const client = await showClientIndex(id)

         let grupoClientes = [];

    if (client.grupo_codigo) {
     grupoClientes = await showClientIndex(id)
    }

    return res.json({
      client,
      grupoClientes
    });

    }

    async statusClient(req, res){
        
        const { id } = req.params
        const { status } = req.body 

        const data = {
            id,
            status
        }
        const client = await updateStatus(data)
        
        return res.json({client})

    }

    async delete(req, res){

        const { clientId } = req.body


        const action = await Action.deleteMany({ client: clientId})
        const client = await Client.findByIdAndDelete({ _id: clientId })

        return res.json({ message: "Cliente removido com sucesso!"})

    }

    async update(req, res){

        const { clientId } = req.params
        const { nome, CNPJ } = req.body

        const client = await Client.updateOne({ _id: clientId}, {
            nome,
            CNPJ
        })

        return res.json({ message: "Atualizado!"})
    }

    

  

    async statusGrupo(req, res){

        const { grupo } = req.params
        const { status } = req.body 
        
        const clients = await Client.find({ grupoEconomico: grupo})

        const newStatus = await Promise.all(
                    clients.map(client =>
                        Client.findByIdAndUpdate(client._id, { status }, {new: true})
                    )
                )

        return res.json({newStatus})
        

    }

    async proxInt( req, res){

        const { id } = req.params
        const { proxInt } = req.body

        const data = {
            id,
            proxInt
        }
        const prox = await proxIntClient(data)

        return res.json({prox})
    }

    async proxIntGrupo(req, res){

        const { grupo } = req.params
        const { proxInt } = req.body 
        
        const clients = await Client.find({ grupoEconomico: grupo})

        const int = await Promise.all(
                    clients.map(client =>
                        Client.findByIdAndUpdate(client._id, { proxInt }, {new: true})
                    )
                )

        return res.json({int})

    }

  
}

export default new ClientController()