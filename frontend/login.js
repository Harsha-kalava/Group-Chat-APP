function logInfunc(e){
    e.preventDefault()
    const logInData = {
        email :e.target.email.value,
        password : e.target.password.value,
    }

    dataFetch(logInData)
}

async function dataFetch(logInData){
    try{
        const userLoginData = await axios.post('http://localhost:3000/user/login',logInData)
        console.log(userLoginData)
    }
    catch(err){
        console.log(err)
    }
}