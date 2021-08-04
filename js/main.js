const people = document.querySelector(".people");
const outside = document.querySelector(".outside-options");
const sendMessage = document.querySelector(".send-message");
const options = document.querySelectorAll(".option");

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

options.forEach(option, () => {
    option.addEventListener("click", () => {
      this.innerHTML = "red";      
    })
});