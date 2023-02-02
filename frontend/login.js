

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
        const userLoginRes = await axios.post('http://localhost:3000/user/login',logInData)
        if(userLoginRes.status === 200){
            alert('login successful')
            localStorage.setItem('username',userLoginRes.data.data.name)
            localStorage.setItem('token',userLoginRes.data.token)
            window.location = 'index.html'
        }
    }
    catch(err){
        console.log(err.response.status)
        if(err.response.status===401){
            alert('Entered wrong credentials. Please enter correct data')
        }
        location.reload()
    }
}