const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

let username;
let mode;
let lastHTML;

const login = document.querySelector(".login");
const send = document.querySelector(".send-message");
const newMessage = document.querySelector('.new-message');
const people = document.querySelector(".people");
const shadow = document.querySelector(".shadow");
const users = document.querySelectorAll(".user");

login.addEventListener("click", () => {
  const name = document.querySelector(".name").value;
  if (name.length < 16 && name !== "") {
    getUsername(name);
  } else {
    alert("Por favor, insira um nome valido com menos de 16 caracteres!");
  }
});

send.addEventListener("click", sendMessage);

newMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
})

people.addEventListener("click", () => {
  document.querySelector(".message-options").classList.remove("hidden");
  checkOnlineUsers();
})

shadow.addEventListener("click", () => {
  document.querySelector(".message-options").classList.add("hidden");
})

function getUsername (name) {
  const promise = axios.post(URL_PARTICIPANTS, {name});
  promise.then(() => {
    document.querySelector(".initial-page").classList.add("hidden");
    document.querySelector(".chat").classList.remove("hidden");
    
    setInterval(getMessages, 3000);
    setInterval(() => {
      axios.post(URL_STATUS, {name})
    }, 5000);
  })
  username = name;
};

function getMessages () {
  const promise = axios.get(URL_MESSAGES);
  promise.then(putMessagesOnDocument);
  promise.catch(checkError);
}

function putMessagesOnDocument (response) {
  const messages = document.querySelector(".messages");
  messages.innerHTML = "";
  for (let message of response.data) {
    switch (message.type) {
      case "status":
        messages.innerHTML += `<li class="${message.type}">
          <span class="time">(${message.time})</span>
          <strong>${message.from}</strong>
          ${message.text}</li>`;
        break;
      
      case "message":
        messages.innerHTML += `<li class="${message.type}">
          <span class="time">(${message.time})</span>
          <strong>${message.from}</strong> para <strong>${message.to}</strong>:
          ${message.text}</li>`;
        break;

      case "private_message":
        if (message.to === username) {
          messages.innerHTML += `<li class="${message.type}">
            <span class="time">(${message.time})</span>
            <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong>:
            ${message.text}</li>`;
        }
        break;
      
      default:
        console.log("mensagem invalida");
        break;
    }
  }

  if (lastHTML !== messages.innerHTML) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  lastHTML = messages.innerHTML;
};

function sendMessage () {
  const time = new Date();

  const message = {
    from: username,
    to: document.querySelector(".user.active").innerText,
    text: newMessage.value,
    type: defineMode(),
    time: time.toLocaleTimeString().slice(0, 8),
  };

  const promise = axios.post(URL_MESSAGES, message);
  promise.then(getMessages);
  promise.catch(checkError);

  newMessage.value = "";
};

function checkOnlineUsers () {
  const promise = axios.get(URL_PARTICIPANTS);
  promise.then(putOnlineUsersOnList);
  promise.catch(checkError);
}

function putOnlineUsersOnList (response) {
  const onlineUsers = document.querySelector(".online-users");
  onlineUsers.innerHTML = `<li class="user active" onclick="activeUser(this);">
    <ion-icon name="person-circle"></ion-icon>
    Todos
  </li>`;
  
  for (let user of response.data) {
    onlineUsers.innerHTML += `<li class="user" onclick="activeUser(this);">
      <ion-icon name="person-circle"></ion-icon>
      ${user.name}
    </li>`;
  }
}

function activeUser (item) {
  const activeUsers = document.querySelectorAll(".user.active");

  activeUsers.forEach(activeUser => {
    activeUser.classList.remove("active");
  });

  item.classList.add("active");
  enablePrivate();
}

function enablePrivate () {
  const activeUser = document.querySelector(".active").innerText;
  const private = document.querySelector(".private");

  if (activeUser === "Todos") {
    private.classList.add("blocked");
  } else {
    private.classList.remove("blocked");
  }
}

function defineMode () {
  const private = document.querySelector(".private");
  if (!private.classList.contains("blocked")) {    
    return private.classList.contains("active") ? "private_message" : "message";
  }
}

function selectMessageMode (item) {
  const blocked = document.querySelector(".blocked");
  const private = document.querySelector(".private");
  const public = document.querySelector(".public");

  if (!blocked) {
    if (item.classList.contains("public")) {
      private.classList.remove("active");
    } else {
      public.classList.remove("active")
    }
    item.classList.add("active")
  }  
}

function checkError () {
  console.log("Deu erro!");
};