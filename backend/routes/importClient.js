import express from 'express'
import multer from 'multer'
import csvParser from 'csv-parser'
import fs from 'fs'
import authMiddleware from '../middlewares/auth.js'
import pool from '../config/db.js' 

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/import-clients', authMiddleware, upload.single('file'), async (req, res) => {
  const results = []

  console.log('🟡 Arquivo recebido:', req.file)

  fs.createReadStream(req.file.path)
    .pipe(csvParser({ separator: ';' }))
    .on('data', (data) => {
      data.user_id = req.userId 
      results.push(data)
    })
    .on('end', async () => {
      try {
        console.log('📄 Dados lidos do CSV:', results)

        const filtrados = results
          .filter(d => d.nome && d.cnpj && d.user_id) 
          .map(d => {
            if (d.grupo_codigo === '') d.grupo_codigo = null
            else if (d.grupo_codigo) d.grupo_codigo = String(d.grupo_codigo).trim()

            d.cnpj = d.cnpj.replace(/\D/g, '') 
            return d
          })

        for (let cliente of filtrados) {
            const query = `
              INSERT INTO clients 
              (nome, codigo, fone, grupo_codigo, nome_grupo, user_id, email, cnpj, status, meses_inativo)
            VALUES 
              ($1,   $2,     $3,   $4,          $5,         $6,      $7,    $8,    'Vazio', $9)
            ON CONFLICT (cnpj, user_id) 
            DO UPDATE SET 
              nome = EXCLUDED.nome,
              codigo = EXCLUDED.codigo,
              fone = EXCLUDED.fone,
              grupo_codigo = EXCLUDED.grupo_codigo,
              nome_grupo = EXCLUDED.nome_grupo,
              email = EXCLUDED.email,
              meses_inativo = EXCLUDED.meses_inativo,
              status = 'Vazio'
          `;

          const values = [
            cliente.nome,
            cliente.codigo,
            cliente.fone,
            cliente.grupo_codigo,
            cliente.nome_grupo,
            cliente.user_id,
            cliente.email,
            cliente.cnpj,
            cliente.meses_inativo
          ];

  await pool.query(query, values)
}

        res.status(200).json({ message: 'Importação concluída', count: filtrados.length })
      } catch (err) {
        console.error('❌ Erro ao importar:', err)
        res.status(500).json({ error: 'Erro ao importar', details: err.message })
      } finally {
        fs.unlinkSync(req.file.path)
      }
    })
})

export default router