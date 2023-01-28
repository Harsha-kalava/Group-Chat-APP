// this function will get userdetails from the signup page.
function userDetails(e){
    e.preventDefault()
    const userData = {
        name : e.target.username.value,
        email : e.target.email.value,
        password : e.target.password.value,
        mobilenum : e.target.number.value
    }

    storeSignupData(userData)
}

async function storeSignupData(userData){
    try{
        console.log('reached')
        const dataStroreRes = await axios.post('http://localhost:3000/user/signup',userData)
        const parentElement = document.getElementById('message-container')
        if(dataStroreRes.status === 201){
            const para = document.createElement("p");
            const textNode = document.createTextNode("Account successfully created!!!");
            para.appendChild(textNode);
            parentElement.appendChild(para)
        }
    }
    catch(err){
        console.log(err)
    }
   
}