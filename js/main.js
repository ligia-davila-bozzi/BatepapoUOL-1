const people = document.querySelector(".people");
const outside = document.querySelector(".outside-options");
const sendMessage = document.querySelector(".send-message");

// Part 1 - Event Listeners

people.addEventListener("click", () => {
  document.querySelector(".options-window").classList.remove("hidden");
});

outside.addEventListener("click", () => {
  document.querySelector(".options-window").classList.add("hidden");
});

sendMessage.addEventListener("click", () => {
  const messages = document.querySelector(".messages");
  messages.innerHTML += `<li class="message normal">${document.querySelector(".new-message").value}</li>`;
});

// Part 2 - Management of messages with promisses

function checkServer () {
  const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
  promise.then(checkMessages);
}

function checkMessages (response) {
  const messages = document.querySelector(".messages");
  console.log(response.data.type);
  for (let message of response.data)
    if (message.type === "status")
      messages.innerHTML += `<li class="${message.type}"><span class="time">(${message.time})</span> <strong>${message.from}</strong> ${message.text}</li>`;
    else if (message.type === "message")
      messages.innerHTML += `<li class="${message.type}"><span class="time">(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}:</strong> ${message.text}</li>`;
}

checkServer();