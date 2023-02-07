const express = require('express')

const router = express.Router()

const grpController = require('../controllers/group')
const authenticateMiddleware = require('../middleware/auth')

router.post('/toCreate',authenticateMiddleware.authenticate,grpController.groupCreation)

router.get('/allgroups',authenticateMiddleware.authenticate,grpController.allGroups)

router.get('/groupid/:id',authenticateMiddleware.authenticate,grpController.groupCheckAndFetch)

router.get('/toadduser',authenticateMiddleware.authenticate,grpController.addUserToGroup)

module.exports = router