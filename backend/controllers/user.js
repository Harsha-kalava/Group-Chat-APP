const User = require('../models/user')
const bcrypt = require('bcrypt')

exports.addUser = async(req,res)=>{
    try{
        const userData = req.body
        if(!userData){
            return res.status(500).json({message:'recieved null from frontend'})
        }
        const name = userData.name
        const password = userData.password
        const number = userData.mobilenum
        const email = userData.email

        const checker = await User.findOne({where:{email:email}})

        if(checker){
            return res.status(503).json({success:false,message:'User already present in the data'})
        }

        bcrypt.hash(password,10,async(err,hash)=>{
            try{
               await User.create({
                    name:name,
                    email:email,
                    password:hash,
                    mobilenumber:number
                })
                return res.status(201).json({success:true,message:'user created successfully'})
            }
            catch(err){
                console.log(err)
                return res.status(500).json({success:false,message:'unable to create user'})
            }
        })
    }
    catch(err){
        return res.status(500)
    }
}