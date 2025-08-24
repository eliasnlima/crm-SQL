import { createUser } from '../models/User.js'

class UserController{

    async store(req, res){

    try {

        const user = await createUser(req.body)
        return res.json({user})
    } catch (err){
        console.log("Erro ao criar usuario!")
    }
       
    }

}

export default new UserController()