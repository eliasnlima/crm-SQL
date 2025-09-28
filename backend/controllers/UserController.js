import { createUser } from '../models/User.js'
import { showUsers } from '../models/User.js'

class UserController{

    async store(req, res){

    try {

        const user = await createUser(req.body)
        return res.json({user})
    } catch (err){
        console.log("Erro ao criar usuario!")
    }
       
    }

    async show(req, res){

        const role = req.query.role || "vendedor"
        const users = await showUsers(role)

        return res.json({users})
    }

}

export default new UserController()