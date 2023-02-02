axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

let getAllClicked = false;

const textarea = document.getElementById("textArea");
  textarea.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      chatButton(event);
    }
  });

console.log(getAllClicked)
document.addEventListener('DOMContentLoaded', async()=>{
    try{
        const userName = localStorage.getItem('username')
        userJoined(userName)
        // if(!getAllClicked){
        //     setInterval(()=>{
        //         getLocalMsgs()
                
        //     },1000)
        // }
        getLocalMsgs()
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
        if(!token){
          window.location = 'login.html'
        }

        let textArea = document.querySelector("textarea");
        let msg = textArea.value;

        textArea.value = ''

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
      // console.log(LocalMsgsRes.data.message,'local')

      let sameData = LocalMsgsRes.data.message

      if((preData.length !== 0) && (preData[preData.length-1].id === sameData[sameData.length-1].id)){
        console.log(preData[preData.length-1].id-1, sameData[sameData.length-1].id,preData.length,sameData.length)
        console.log('entered in if block',preData[0])
        let datalocal = JSON.parse(localStorage.getItem('data'))
        return showMsgs(datalocal)
      }
      let allLocalMsgs
  
      if(preData.length === 0){
        allLocalMsgs = LocalMsgsRes.data.message
      }else{
        allLocalMsgs = [...preData,...LocalMsgsRes.data.message]
        let uniqueIds = new Set();
        allLocalMsgs= allLocalMsgs.filter(item => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });

        console.log(allLocalMsgs)
        console.log('entered 1')
      }
  
      if(allLocalMsgs.length>10){
        console.log(allLocalMsgs)
        const msgAfterSlice = allLocalMsgs.slice(allLocalMsgs.length - 10, allLocalMsgs.length)
        console.log(allLocalMsgs.length,'after slice')
        localStorage.setItem('data',JSON.stringify(msgAfterSlice))
      }else{
        localStorage.setItem('data',JSON.stringify(allLocalMsgs))
        console.log('entered 2')
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
        // console.log(allMsgs)
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

async function createGroup(){
  try{
    const parentElement = document.getElementById('group-list')
    const groupName = prompt('Please enter your group name')
    console.log(groupName)
    const groupCreationAPIres = await axios.post('http://localhost:3000/group/toCreate',{groupName},)
    console.log(groupCreationAPIres)
    if(groupCreationAPIres.status === 201){
      console.log(groupCreationAPIres.data.message.GroupName)
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = `http://localhost:3000/group/${groupCreationAPIres.data.message.id}`;
      a.textContent = `${groupCreationAPIres.data.message.GroupName}`;
      li.appendChild(a)
      parentElement.appendChild(li)
    }
  }
  catch(err){
    console.log(err)
  }
}