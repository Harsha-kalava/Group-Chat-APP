let getAllClicked = false;

console.log(getAllClicked)
document.addEventListener('DOMContentLoaded', async()=>{
    try{
        const userName = localStorage.getItem('username')
        userJoined(userName)
        if(!getAllClicked){
            setInterval(()=>{
                getLocalMsgs()
                
            },1000)
        }
    }
    catch(err){
        console.log(err)
    }
})

function userJoined(userName){
    let newMessage = document.createElement("div")
    newMessage.classList.add("message-container")
    let messageText = document.createElement("p")
    messageText.classList.add("message-text")
    messageText.innerText = `${userName} joined`
    newMessage.appendChild(messageText)
    document.querySelector(".chat-messages").appendChild(newMessage)
}

async function chatButton(){
    try{
        const token = localStorage.getItem('token')

        let textArea = document.querySelector("textarea");
        let msg = textArea.value;

        let newMessage = document.createElement("div")
        newMessage.classList.add("message-container-right")
        let messageText = document.createElement("p")
        messageText.classList.add("message-text")
        messageText.innerText = `You :  ${msg}`
        newMessage.appendChild(messageText)
        document.querySelector(".chat-messages").appendChild(newMessage)

        await axios.post('http://localhost:3000/msg/tostore',{msg},{ headers: { Authorization: token }})
    }
    catch(err){
        console.log(err)
    }  
}

async function getAll(){
    try{
        getAllClicked = true
        const allMsgsRes = await axios.get('http://localhost:3000/msg/toget')
        // console.log(allMsgsRes.data.message)
        const allMsgs = allMsgsRes.data.message
        showMsgs(allMsgs)
    }
    catch(err){
        console.log(err)
    }
}

async function getLocalMsgs(){
    if(!getAllClicked){
    try{
      let preData = JSON.parse(localStorage.getItem('data')) || [];
    //   console.log(preData)
  
      let lastMsgId
  
      if(preData.length !==0){
        lastMsgId = preData[preData.length-1].id
        // console.log(lastMsgId)
      }
      else{
        lastMsgId = -1
      }
  
      const LocalMsgsRes = await axios.get(`http://localhost:3000/msg/localmsg?id=${lastMsgId}`)
      console.log(LocalMsgsRes.data.message,'local')

      let sameData = LocalMsgsRes.data.message

      

      if((preData.length !== 0) && (preData[preData.length-1].id === sameData[sameData.length-1].id)){
        console.log(preData[preData.length-1].id, sameData[sameData.length-1].id)
        console.log('entered in if block')
        let datalocal = JSON.parse(localStorage.getItem('data'))
        return showMsgs(datalocal)
      }
  
      let allLocalMsgs
  
      if(preData.length === 0){
        allLocalMsgs = LocalMsgsRes.data.message
      }else{
        allLocalMsgs = [...preData,...LocalMsgsRes.data.message]
      }
  
      if(allLocalMsgs.length>10){
        const msgAfterSlice = allLocalMsgs.slice(allLocalMsgs.length - 10, allLocalMsgs.length)
        localStorage.setItem('data',JSON.stringify(msgAfterSlice))
      }else{
        localStorage.setItem('data',JSON.stringify(allLocalMsgs))
      }
  
      let datalocal = JSON.parse(localStorage.getItem('data'))
    //   console.log(datalocal)
      showMsgs(datalocal)
    }
    catch(err){
      console.log(err,'happend in frontend')
    }
}
  }

  
async function showMsgs(allMsgs){
    try{
        console.log(allMsgs)
        document.getElementById('chatblock').innerHTML = ''
        const user = localStorage.getItem('username')
        allMsgs.forEach(data => {
            let msgText = data.message
            let userName = data.user.name
            // console.log(msgText,userName)

            let newMessage = document.createElement("div");

            if(user !== userName){
                newMessage.classList.add("message-container-left")
                let messageText = document.createElement("p")
                messageText.classList.add("message-text")
                messageText.innerText = `${userName}:  ${msgText}`
                newMessage.appendChild(messageText)
                document.querySelector(".chat-messages").appendChild(newMessage)
            }else{
                newMessage.classList.add("message-container-right")
                let messageText = document.createElement("p")
                messageText.classList.add("message-text")
                messageText.innerText = `You :  ${msgText}`
                newMessage.appendChild(messageText)
                document.querySelector(".chat-messages").appendChild(newMessage)
            }     
        });
    }
    catch(err){
        console.log(err)
    }
}