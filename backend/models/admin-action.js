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
    SELECT DISTINCT
    CASE 
        WHEN c.grupo_codigo IS NULL THEN c.codigo::text
        ELSE c.grupo_codigo::text 
    END AS codigo,
    CASE 
        WHEN c.grupo_codigo IS NULL THEN c.nome
        ELSE c.nome_grupo 
    END AS nome,
    c.grupo_codigo
FROM clients c
WHERE c.user_id = $1
  AND (
      -- Clientes individuais sem ações no período
      (
          c.grupo_codigo IS NULL
          AND NOT EXISTS (
              SELECT 1
              FROM actions a
              WHERE a.client_id = c.id
              AND a.date::date BETWEEN $2 AND $3
              AND a.user_id = c.user_id
          )
      )
      OR
      -- Grupos sem ações no período
      (
          c.grupo_codigo IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM actions a
              WHERE a.grupo_codigo = c.grupo_codigo
              AND a.date::date BETWEEN $2 AND $3
              AND a.user_id = c.user_id
          )
      )
  )
ORDER BY c.grupo_codigo;`, [user_id, inicio, fim])

    return res.rows;

}
