const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = require('./backend/util/database')
const User = require('./backend/models/user')


const userRoutes = require('./backend/routes/user')

const app = express()
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(bodyParser.json())

app.use("/user",userRoutes)

sequelize.sync({alter:true})
.then((res)=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log('app started running')
    })
})