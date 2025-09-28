import pool from '../config/db.js'
import bcrypt from "bcryptjs";

export async function createUser(user) {
    
    try {

    const passwordHash = await bcrypt.hash(user.password, 8)
    
    const res = await pool.query('INSERT INTO users (name, password_hash) VALUES ($1, $2) RETURNING id, name', [user.name, passwordHash])

    return res.rows;

    } catch (err){
        console.error("Erro ao cadastrar user!", err)
        throw err;
    }
}

export async function findUser(name) {
    
    const res = await pool.query('SELECT id, name, password_hash, role FROM users WHERE name=$1', [name])

    return res.rows[0];

}

export async function showUsers(role) {
    
    const res = await pool.query('SELECT * from users WHERE role=$1', [role])

    return res.rows;
}
