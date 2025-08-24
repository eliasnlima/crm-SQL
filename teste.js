import express from 'express'
import multer from 'multer'
import csvParser from 'csv-parser'
import fs from 'fs'
import Client from '../models/Client.js'
import authMiddleware from '../middlewares/auth.js'


const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.post('/import-clients', authMiddleware, upload.single('file'), async (req, res) => {
  const results = []

  console.log('🟡 Arquivo recebido:', req.file) 

  fs.createReadStream(req.file.path)
    .pipe(csvParser({ separator: ';' }))
    .on('data', (data) => {
      data.user = req.userId
      results.push(data)
    })
    .on('end', async () => {
      try {
        console.log('📄 Dados lidos do CSV:', results) 
        


        
        const filtrados = results.filter(d => d.nome && d.user)
  .map(d => {
    
    if (d.grupoEconomico === '') d.grupoEconomico = null
    else if (d.grupoEconomico) d.grupoEconomico = String(d.grupoEconomico).trim()

    return d
  })

        for (let cliente of filtrados) {
          await Client.create(cliente);
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