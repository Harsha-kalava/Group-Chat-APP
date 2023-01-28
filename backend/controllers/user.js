const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.addUser = async(req,res)=>{
    try{
        const userData = req.body
        if((!userData)||(Object.values(userData).some(val => val.length <= 0))){
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

function generateAccessToken(id){
    return jwt.sign({userId:id},process.env.TOKEN)
}

exports.userLogin = async (req,res)=>{
    const {email,password} = req.body
    try{
        const usercheck = await User.findOne({where:{email:email}})
        if(!usercheck){
            return res.status(404).json({success:false,message:'user not found'})
        }
        const userPwCheck = await bcrypt.compare(password,usercheck.password)
        if(!userPwCheck){
            return res.status(401).json({success:false,message:'wrong password'})
        }
        return res.status(200).json({success:true,message:'user logged in successful',token:generateAccessToken(usercheck.id)})
    }
    catch(err){
        console.log(err)
    }
    
}