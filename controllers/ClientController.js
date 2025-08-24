import Client from "../models/Client.js"
import Action from "../models/Action.js"


class ClientController{

    async show(req, res){
        
        const { userId } = req.userId

        const clients = await Client.find({ user: req.userId})

        return res.json({clients})

    }

    async store(req, res){

        const { nome, CNPJ, fone, email, status, codigo } = req.body
        const user = req.userId

        const client = await Client.create({ nome, CNPJ, user, fone, email, status, codigo })

        return res.status(201).json({ message: "Cliente cadastrado com sucesso", client})

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

    async index(req, res){
        
        const { clientId } = req.params

        const client = await Client.findOne({_id: clientId})

     

         let grupoClientes = [];

    if (client.grupoEconomico) {
      grupoClientes = await Client.find({
        grupoEconomico: client.grupoEconomico,
        _id: { $ne: client._id } 
      });
    }

    return res.json({
      client,
      grupoClientes
    });

    }

    async statusClient(req, res){
        
        const { clientId } = req.params
        const { status } = req.body 
        
        const client = await Client.findByIdAndUpdate(clientId, { status }, {new: true})
        return res.json({client})

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

        const { clientId } = req.params
        const { proxInt } = req.body

        const prox = await Client.findByIdAndUpdate(clientId, { proxInt }, {new: true})

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