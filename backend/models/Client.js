import pool from '../config/db.js'

export async function create(client) {
    
    try {
        const res = await pool.query('INSERT INTO clients (nome, cnpj, user_id, fone, email) VALUES ($1, $2, $3, $4, $5) RETURNING *', [client.nome, client.cnpj, client.user_id, client.fone, client.email])

        return res.rows[0];
    } catch(err){
        console.error('Erro ao criar cliente novo!', err)
        throw err;
    }


}

export async function showClients(user_id) {
    
    const res = await pool.query('SELECT * FROM clients WHERE user_id=$1', [user_id])

    return res.rows;

}

export async function showClientIndex(id) {
    
    const res = await pool.query('SELECT * FROM clients WHERE id=$1', [id])
    
    return res.rows[0]

}

export async function updateStatus(client) {
    
    const res = await pool.query('UPDATE clients SET status=$1 WHERE id=$2 RETURNING *', [client.status, client.id])

    return res.rows[0];
}

export async function proxIntClient(client) {
    
    const res = await pool.query('UPDATE clients SET prox_int=$1 WHERE id=$2 RETURNING *', [client.proxInt, client.id])

    return res.rows[0]
}