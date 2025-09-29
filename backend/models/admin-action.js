import pool from "../config/db.js";

export async function showActionQtd(date, user_id) {
    
    const res = await pool.query("SELECT COUNT(id) AS quantidade_de_acoes FROM public.actions WHERE CAST(date AS DATE) = $1 AND user_id = $2;", [date, user_id])

    return res.rows[0];

}