axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

let getAllClicked = false;

const textarea = document.getElementById("textArea");
textarea.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    chatButton(event);
  }
});

console.log(getAllClicked);
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userName = localStorage.getItem("username");
    userJoined(userName);
    if(!getAllClicked){
        setInterval(()=>{
            getLocalMsgs()

        },1000)
    }
    // getLocalMsgs()
    allGroups();
  } catch (err) {
    console.log(err);
  }
});

function userJoined(userName) {
  let newMessage = document.createElement("div");
  newMessage.classList.add("message-container");
  let messageText = document.createElement("p");
  messageText.classList.add("message-text");
  messageText.innerText = `${userName} joined`;
  newMessage.appendChild(messageText);
  document.querySelector(".chat-messages").appendChild(newMessage);
}


async function chatButton() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location = "login.html";
    }

    let textArea = document.querySelector("textarea");
    let msg = textArea.value;

    textArea.value = "";

    const groupId = localStorage.getItem("groupId")
    ? localStorage.getItem("groupId")
    :1

    let newMessage = document.createElement("div");
    newMessage.classList.add("message-container-right");
    let messageText = document.createElement("p");
    messageText.classList.add("message-text");

    if(msg.includes('http')){
      let link = msg;
      await axios.post(
        `http://localhost:3000/msg/tostore/${groupId}`,
        { msg: link},
        { headers: { Authorization: token } }
      );
      messageText.innerHTML = `You : <a href="#" onclick="linkClicked(${groupId})">Join link</a>`
    }else{
      await axios.post(
        `http://localhost:3000/msg/tostore/${groupId}`,
        { msg },
        { headers: { Authorization: token } }
      );
      messageText.innerHTML = `You :  ${msg}`;
    }
    newMessage.appendChild(messageText);
    document.querySelector(".chat-messages").appendChild(newMessage);

  } catch (err) {
    console.log(err);
  }
}

async function getAll() {
  try {
    getAllClicked = true;
    const groupId = localStorage.getItem('groupId')
    const allMsgsRes = await axios.get(`http://localhost:3000/msg/toget/${groupId}`);
    // console.log(allMsgsRes.data.message)
    const allMsgs = allMsgsRes.data.message;
    showMsgs(allMsgs);
  } catch (err) {
    console.log(err);
  }
}

let latestMessageId = localStorage.getItem("latestMessageId") || 0;

async function getLocalMsgs() {
  if (!getAllClicked) {
    let groupId = localStorage.getItem("groupId");
    const LocalMsgsRes = await axios.get(
      `http://localhost:3000/msg/localmsg?groupId=${groupId}&latestId=${latestMessageId}`
    );
    console.log(LocalMsgsRes.data.message, "local");
    let messages = LocalMsgsRes.data.message;
    let currentMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Only add new messages to the currentMessages array
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id > latestMessageId) {
        currentMessages.push(messages[i]);
        latestMessageId = messages[i].id;
      }
    }

    currentMessages = currentMessages.slice(-10);
    localStorage.setItem("messages", JSON.stringify(currentMessages));
    let info = JSON.parse(localStorage.getItem("messages"));
    console.log(info, "info");
    showMsgs(info);
  }
}





// async function getLocalMsgs() {
//   if (!getAllClicked) {
//     try {
//       let preData = JSON.parse(localStorage.getItem("data")) || [];
//       let groupId = localStorage.getItem("groupId")


//       let lastMsgId;

//       if (preData.length !== 0) {
//         lastMsgId = preData[preData.length - 1].id;
//         console.log(lastMsgId,'lastmsg ID')
//       } else {
//         lastMsgId = -1;
//       }

//       const LocalMsgsRes = await axios.get(
//         `http://localhost:3000/msg/localmsg?id=${lastMsgId}&groupId=${groupId}`
//       );
//       console.log(LocalMsgsRes.data.message,'local')

//       let sameData = LocalMsgsRes.data.message;

//       if (
//         (preData.length !== 0 ) &&  (sameData.length !== 0) &&
//         (preData[preData.length - 1].id === sameData[sameData.length - 1].id) 
//       ) {
//         console.log(

//           preData[preData.length - 1].id - 1,
//           sameData[sameData.length - 1].id,
//           preData.length,
//           sameData.length
//         )
//         let datalocal = JSON.parse(localStorage.getItem("data"));
//         return showMsgs(datalocal);
//       }
//       let allLocalMsgs;

//       if (preData.length === 0) {
//         allLocalMsgs = LocalMsgsRes.data.message;
//       } else {
//         allLocalMsgs = [...preData, ...LocalMsgsRes.data.message];
//         let uniqueIds = new Set();
//         allLocalMsgs = allLocalMsgs.filter((item) => {
//           if (!uniqueIds.has(item.id)) {
//             uniqueIds.add(item.id);
//             return true;
//           }
//           return false;
//         });

//         // console.log(allLocalMsgs);
//       }

//       if (allLocalMsgs.length > 10) {
//         console.log(allLocalMsgs);
//         const msgAfterSlice = allLocalMsgs.slice(
//           allLocalMsgs.length - 10,
//           allLocalMsgs.length
//         );
//         console.log(allLocalMsgs.length, "after slice");
//         localStorage.setItem("data", JSON.stringify(msgAfterSlice));
//       } else {
//         localStorage.setItem("data", JSON.stringify(allLocalMsgs));
//         // console.log("entered 2");
//       }

//       let datalocal = JSON.parse(localStorage.getItem("data"));
//       //   console.log(datalocal)
//       showMsgs(datalocal);
//     } catch (err) {
//       console.log(err, "happend in frontend");
//     }
//   }
// }

async function showMsgs(allMsgs) {
  try {
    document.getElementById("chatblock").innerHTML = "";
    const user = localStorage.getItem("username");
    allMsgs.forEach((data) => {
      let msgText = data.message;
      let userName = data.user.name;

      let newMessage = document.createElement("div");
      
      if (user !== userName) {
        newMessage.classList.add("message-container-left");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        
        if (msgText.startsWith("http://localhost:3000/group/groupid/")) {
          const url = msgText;
          const lastSlashIndex = url.lastIndexOf('/');
          console.log(lastSlashIndex)
          const groupId = url.substring(lastSlashIndex + 1);
          messageText.innerHTML = `${userName}:  <a href="#" onclick="linkClicked(${groupId})">Join link</a>`;
        } else {
          messageText.innerText = `${userName}:  ${msgText}`;
        }

        newMessage.appendChild(messageText);
        document.querySelector(".chat-messages").appendChild(newMessage);
      } else {
        newMessage.classList.add("message-container-right");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        
        if (msgText.startsWith("http://localhost:3000/group/groupid/")) {
          const url = msgText;
          const lastSlashIndex = url.lastIndexOf('/');
          const groupId = url.substring(lastSlashIndex + 1);
          messageText.innerHTML = `You:  <a href="#" onclick="linkClicked(${groupId})">Join link</a>`;
        } else {
          messageText.innerText = `You:  ${msgText}`;
        }

        newMessage.appendChild(messageText);
        document.querySelector(".chat-messages").appendChild(newMessage);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function createGroup() {
  try {
    const groupName = prompt("Please enter your group name");
    console.log(groupName);
    const groupCreationAPIres = await axios.post(
      "http://localhost:3000/group/toCreate",
      { groupName }
    );
    console.log(groupCreationAPIres);
    if (groupCreationAPIres.status === 201) {
      groupUI(groupCreationAPIres.data)
    }
  } catch (err) {
    console.log(err);
  }
}

function groupUI(data) {
  data = data.message;
  const parentElement = document.getElementById("group-list");
  data.forEach((item) => {
    let li = document.createElement("li");
    let groupText = document.createElement("div");
    groupText.classList.add("group-text");
    groupText.id = `${item.id}`
    groupText.textContent = `${item.GroupName}`;
    groupText.addEventListener("click", () => switchGroup(item.id));
    li.appendChild(groupText);
    
    let inviteLink = document.createElement("p");
    inviteLink.className = "invite";
    inviteLink.innerHTML = `<a href="http://localhost:3000/group/groupid/${item.id}">Invite</a>`
    inviteLink.addEventListener("click", () => linkClicked(item.id));
    li.appendChild(inviteLink);
    
    parentElement.appendChild(li);
  });
  
  return;
}

async function linkClicked(id) {
  try {
    console.log("clicked on the group link", id)
    alert('Are you sure to join in this group')
    const userCheckInGroupRes = await axios.get(`http://localhost:3000/group/toadduser?groupId=${id}`)
    console.log(userCheckInGroupRes.status)
    if(userCheckInGroupRes.status === 200){
      alert('You are already a member in this group')
    }
    alert('Successfully joined in this gorup')
  } catch (err) {
    console.log(err);
  }
}

async function switchGroup(id) {
  try {
    console.log("Switching to group", id);
    localStorage.removeItem("messages")
      const groupId = localStorage.setItem("groupId",id)
      await location.reload()
  } catch (err) {
    console.log(err);
  }
}


async function allGroups() {
  try {
    const newGroupRes = await axios.get(
      "http://localhost:3000/group/allgroups"
    )
    groupUI(newGroupRes.data);
  } catch (err) {
    console.log(err);
  }
}
