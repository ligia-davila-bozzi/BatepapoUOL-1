const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

let username;
let lastHTML;

const login = document.querySelector(".login");
const send = document.querySelector(".send-message");
const newMessage = document.querySelector('.new-message');
const people = document.querySelector(".people");
const shadow = document.querySelector(".shadow");

login.addEventListener("click", getUsername);

send.addEventListener("click", sendMessage);

newMessage.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
})

people.addEventListener("click", () => {
  document.querySelector(".message-options").classList.remove("hidden");
  setInterval(checkOnlineUsers, 3000);
})

shadow.addEventListener("click", () => {
  document.querySelector(".message-options").classList.add("hidden");
})

function getUsername () {
  const name = document.querySelector(".name").value;
  const promise = axios.post(URL_PARTICIPANTS, {name});
  promise.then(() => {
    if (name !== "" || name.toLowerCase() === "todos") {
      document.querySelector(".initial-page").classList.add("hidden");
      document.querySelector(".chat").classList.remove("hidden");
    }
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
    to: "Todos",
    text: newMessage.value,
    type: "message",
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
  onlineUsers.innerHTML = `<li class="user active">
    <ion-icon name="person-circle"></ion-icon>
    Todos
  </li>`;
  
  for (let user of response.data) {
    onlineUsers.innerHTML += `<li class="user">
      <ion-icon name="person-circle"></ion-icon>
      ${user.name}
    </li>`;
  }
}

function checkError () {
  console.log("Deu erro!");
};