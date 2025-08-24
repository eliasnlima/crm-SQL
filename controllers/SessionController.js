import { findUser } from '../models/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'

dotenv.config()

class SessionController{
    
    async login(req,res){

        const { name, password} = req.body
        
        const user = await findUser(name)

       if(!user || !bcrypt.compareSync(password, user.password_hash)){
            return res.status(401).json({ error: "Email ou senha incorretos" });
       }

       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
       })

       return res.json({ user: { id: user.id, name: user.name }, token})
    }
}

export default new SessionController()