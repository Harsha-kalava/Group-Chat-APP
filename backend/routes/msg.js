const express = require('express')

const router = express.Router()

const msgController = require('../controllers/msg')
const authenticateMiddleware = require('../middleware/auth')

router.post('/tostore',authenticateMiddleware.authenticate,msgController.addMsg)

router.get('/toget',msgController.getMsg)

module.exports = router