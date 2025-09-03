import pool from "../config/db.js";

export async function createAction(client) {
    
    const res = await pool.query('INSERT INTO actions (descricao, client_id, user_id) VALUES ($1, $2, $3) RETURNING *', [client.descricao, client.client_id, client.user_id])
    return res.rows[0]

}

export async function showActions(id) {
    
    const res = await pool.query('SELECT * FROM actions WHERE client_id=$1', [id])

    return res.rows;
}
