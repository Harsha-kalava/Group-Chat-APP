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
        console.log(logInData)
    }
    catch(err){
        console.log(err)
    }
}