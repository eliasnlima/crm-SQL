import pool from '../config/db.js'

export async function create(client) {
    
    try {
        const res = await pool.query('INSERT INTO clients (nome, cnpj, user_id, fone) VALUES ($1, $2, $3, $4) RETURNING *', [client.nome, client.cnpj, client.user_id, client.fone])

        return res.rows[0];
    } catch(err){
        console.error('Erro ao criar cliente novo!', err)
        throw err;
    }


}