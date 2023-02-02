const express = require('express')

const router = express.Router()

const grpController = require('../controllers/group')
const authenticateMiddleware = require('../middleware/auth')

router.post('/toCreate',grpController.groupCreation)

module.exports = router