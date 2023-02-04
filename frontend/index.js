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
    // if(!getAllClicked){
    //     setInterval(()=>{
    //         getLocalMsgs()

    //     },1000)
    // }
    getLocalMsgs();
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

    let newMessage = document.createElement("div");
    newMessage.classList.add("message-container-right");
    let messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.innerText = `You :  ${msg}`;
    newMessage.appendChild(messageText);
    document.querySelector(".chat-messages").appendChild(newMessage);

    const groupId = localStorage.getItem("groupId")
    ? localStorage.getItem("groupId")
    :0

    await axios.post(
      `http://localhost:3000/msg/tostore/${groupId}`,
      { msg },
      { headers: { Authorization: token } }
    );
  } catch (err) {
    console.log(err);
  }
}

async function getAll() {
  try {
    getAllClicked = true;
    const allMsgsRes = await axios.get("http://localhost:3000/msg/toget");
    // console.log(allMsgsRes.data.message)
    const allMsgs = allMsgsRes.data.message;
    showMsgs(allMsgs);
  } catch (err) {
    console.log(err);
  }
}

async function getLocalMsgs() {
  if (!getAllClicked) {
    try {
      let preData = JSON.parse(localStorage.getItem("data")) || [];
      let groupId = localStorage.getItem("groupId")
      ? localStorage.getItem("groupId")
      : 0

      let lastMsgId;

      if (preData.length !== 0) {
        lastMsgId = preData[preData.length - 1].id;
        // console.log(lastMsgId)
      } else {
        lastMsgId = -1;
      }

      const LocalMsgsRes = await axios.get(
        `http://localhost:3000/msg/localmsg?id=${lastMsgId}&groupId=${groupId}`
      );
      // console.log(LocalMsgsRes.data.message,'local')

      let sameData = LocalMsgsRes.data.message;

      if (
        preData.length !== 0 &&
        preData[preData.length - 1].id === sameData[sameData.length - 1].id
      ) {
        console.log(
          preData[preData.length - 1].id - 1,
          sameData[sameData.length - 1].id,
          preData.length,
          sameData.length
        )
        let datalocal = JSON.parse(localStorage.getItem("data"));
        return showMsgs(datalocal);
      }
      let allLocalMsgs;

      if (preData.length === 0) {
        allLocalMsgs = LocalMsgsRes.data.message;
      } else {
        allLocalMsgs = [...preData, ...LocalMsgsRes.data.message];
        let uniqueIds = new Set();
        allLocalMsgs = allLocalMsgs.filter((item) => {
          if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });

        // console.log(allLocalMsgs);
      }

      if (allLocalMsgs.length > 10) {
        console.log(allLocalMsgs);
        const msgAfterSlice = allLocalMsgs.slice(
          allLocalMsgs.length - 10,
          allLocalMsgs.length
        );
        console.log(allLocalMsgs.length, "after slice");
        localStorage.setItem("data", JSON.stringify(msgAfterSlice));
      } else {
        localStorage.setItem("data", JSON.stringify(allLocalMsgs));
        // console.log("entered 2");
      }

      let datalocal = JSON.parse(localStorage.getItem("data"));
      //   console.log(datalocal)
      showMsgs(datalocal);
    } catch (err) {
      console.log(err, "happend in frontend");
    }
  }
}

async function showMsgs(allMsgs) {
  try {
    // console.log(allMsgs)
    document.getElementById("chatblock").innerHTML = "";
    const user = localStorage.getItem("username");
    allMsgs.forEach((data) => {
      let msgText = data.message;
      let userName = data.user.name;
      // console.log(msgText,userName)

      let newMessage = document.createElement("div");

      if (user !== userName) {
        newMessage.classList.add("message-container-left");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        messageText.innerText = `${userName}:  ${msgText}`;
        newMessage.appendChild(messageText);
        document.querySelector(".chat-messages").appendChild(newMessage);
      } else {
        newMessage.classList.add("message-container-right");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        messageText.innerText = `You :  ${msgText}`;
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
  console.log(data)
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
parentElement.appendChild(li)
    

let inviteLink = document.createElement("a")
inviteLink.href = `/join?groupId=${item.id}`
inviteLink.className = 'invite'
inviteLink.textContent = "Invite"
li.appendChild(inviteLink)

parentElement.appendChild(li)

  });
  
  return
}
async function linkClicked(id) {
  try {
    console.log("clicked on the group link", id);
    const newGroupRes = await axios.get(`http://localhost:3000/group/groupid/${id}`);
    if(newGroupRes.status === 201){
      
      window.location = 'login.html'
    }
  } catch (err) {
    console.log(err);
  }
}

async function switchGroup(id) {
  try {
    console.log("Switching to group", id);
    localStorage.removeItem("data")
    // const newGroupRes = await axios.get(`http://localhost:3000/group/groupid/${id}`);
    // if (newGroupRes.status === 201) {
      const groupId = localStorage.setItem("groupId",id)
      await location.reload()
      // const groupData = newGroupRes.data;
      // modify the content of the page to display the new group data
      // const chatContainer = document.getElementById("chat-container");
      // chatContainer.innerHTML = `
      //   <h1>Group: ${groupData.groupName}</h1>
      //   <ul id="message-list">
      //     <!-- Add the messages for this group here -->
      //   </ul>
      // `;
      // // add messages to the message list
      // const messageList = document.getElementById("message-list");
      // groupData.messages.forEach(message => {
      //   const li = document.createElement("li");
      //   li.textContent = message;
      //   messageList.appendChild(li);
      // });
    // }
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
