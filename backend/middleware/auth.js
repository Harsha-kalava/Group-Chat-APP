const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authenticate = async(req,res,next)=>{
    try{
        console.log('reached to middleware')
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json({success:false, message: 'No token provided'})
          }
        const user = jwt.verify(token,process.env.TOKEN)
        // console.log(user,'user logging')
        User.findByPk(user.userId).then(user=>{
            req.user=user
            // console.log(user,'user')
            next()
        })
    }
    catch(err){
        console.log(err)
        res.status(401).json({success:false,message:'failed at auth.js'})
    }
}

