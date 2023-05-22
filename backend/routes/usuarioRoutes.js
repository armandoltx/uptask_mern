import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Desde API/Usuarios')
})

router.get('/confirmar', (req, res) => {
  res.json({ msg: "Confirmando usuario" })
})

router.post('/', (req, res) => {
  res.send('Desde post API/Usuarios')
})

export default router