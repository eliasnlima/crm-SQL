import pool from "../config/db.js";

export async function showActionQtd(date, user_id) {
    
    const res = await pool.query(`
        SELECT COUNT(*) AS quantidade_de_acoes
    FROM (

    SELECT DISTINCT grupo_codigo AS entidade
    FROM public.actions
    WHERE CAST(date AS DATE) = $1
      AND user_id = $2
      AND grupo_codigo IS NOT NULL

    UNION

    SELECT DISTINCT client_id AS entidade
    FROM public.actions
    WHERE CAST(date AS DATE) = $1
      AND user_id = $2
      AND client_id IS NOT NULL
) AS entidades;`, [date, user_id])

    return res.rows[0];

}

export async function showActionNull(user_id, inicio, fim) {
    
    const res = await pool.query(`
    SELECT
    c.codigo,
    c.nome
FROM
    public.clients AS c
LEFT JOIN
    public.actions AS a ON c.codigo = a.client_id
    AND a.user_id = $1
    AND a.date >= $2
    AND a.date < $3
WHERE
    a.id IS NULL`, [user_id, inicio, fim])

    return res.rows;

}
