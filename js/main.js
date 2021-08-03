const people = document.querySelector(".people");
const outside = document.querySelector(".outside-options");

function hideOptions () {
  document.querySelector(".outside-options").classList.add("hidden");
  document.querySelector(".options").classList.add("hidden");
}

people.addEventListener("click", () => {
  document.querySelector(".outside-options").classList.remove("hidden");
  document.querySelector(".options").classList.remove("hidden");
})

outside.addEventListener("click", () => hideOptions());