import { findUser } from '../models/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'

dotenv.config()

class SessionController{
    
    async login(req,res){

        const { name, password} = req.body
        
        const user = await findUser(name)
 
        if (!user) {  
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

       const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d"
       })

       return res.json({ user: { id: user.id, name: user.name, role: user.role }, token})
    }
}

export default new SessionController()