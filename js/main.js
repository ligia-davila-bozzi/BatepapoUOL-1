const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";

let username;

const people = document.querySelector(".people");
const outside = document.querySelector(".outside-options");
const login = document.querySelector(".login");

// Part 1 - Event Listeners

people.addEventListener("click", () => {
  document.querySelector(".options-window").classList.remove("hidden");
});

outside.addEventListener("click", () => {
  document.querySelector(".options-window").classList.add("hidden");
});

login.addEventListener("click", () => {
  username = document.querySelector(".username").value;
  
  if (username) {
    document.querySelector(".initial-page").classList.add("hidden");
    document.querySelector(".chat").classList.remove("hidden");
  } else {
    alert("Por favor, digite um nome de usuario valido!");
  }

  loginServer(username);
});

// Part 2 - Management of messages with promisses

function loginServer (username) {
  const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {
    name: username,
  });

  promise.then(sendMessage);
  promise.catch(checkError);

  setInterval(() => {
    keepLogin(username)
  }, 3000);
}

function keepLogin (username) {
  const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {
    name: username,
  });
  promise.then(checkServer);
  promise.catch(checkError);
}

function sendMessage (response) {
  const time = new Date();
  const promise = axios.post(URL_MESSAGES, {
    from: response.data.name,
    to: "Todos",
    text: "entrou na sala...",
    type: "status",
    time: time.toLocaleTimeString().slice(0, 8),
  });

  promise.then(checkMessages);
  promise.catch(checkError);
}

function checkServer () {
  const promise = axios.get(URL_MESSAGES);
  promise.then(checkMessages);
  promise.catch(checkError);
}

function checkMessages (response) {
  const messages = document.querySelector(".messages");
  messages.innerHTML = "";
  for (let message of response.data) {
    switch (message.type) {
      case "status":
        messages.innerHTML += `<li class="${message.type}"><span class="time">(${message.time})</span> <strong>${message.from}</strong> ${message.text}</li>`;
        break;
      
      case "message":
        messages.innerHTML += `<li class="${message.type}"><span class="time">(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}:</strong> ${message.text}</li>`;
        break;
      
      default:
        console.log("mensagem desconhecida");
        break;
    }
  }
}

function checkError (error) {
  switch (error.response.status) {
    case 404:
      break;
    case 409:
      break;
    case 422:
      break;
    default:
      break;
  }
}