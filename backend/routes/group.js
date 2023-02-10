const express = require('express')

const router = express.Router()

const grpController = require('../controllers/group')
const authenticateMiddleware = require('../middleware/auth')

router.post('/toCreate',authenticateMiddleware.authenticate,grpController.groupCreation)

router.get('/allgroups',authenticateMiddleware.authenticate,grpController.allGroups)

router.get('/groupid/:id',authenticateMiddleware.authenticate,grpController.groupCheckAndFetch)

router.get('/toadduser',authenticateMiddleware.authenticate,grpController.addUserToGroup)

router.get('/togetAllusers',grpController.allMembersInGroup)

router.put('/makeAdmin',authenticateMiddleware.authenticate,grpController.makeAdmin)

router.delete('/deleteUser',authenticateMiddleware.authenticate,grpController.deleteUser)

module.exports = router