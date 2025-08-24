import jwt from 'jsonwebtoken'

export default function auth(req, res, next){

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({ error: "Token não gerado!"})
    }

    const [, token] = authorization.split(' ')

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id 
        next()
    } catch (err){
        return res.status(401).json({ error: "Token expirado!"})
    }

}