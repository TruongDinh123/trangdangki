var username = document.querySelector("#id");
var email = document.querySelector("#email");
var password = document.querySelector("#passwor");
var confirmPassword = document.querySelector("#confirm-password");

function showError(input, messsage) {
  let parent = input.parentElement;
  let small = paren.querySelector("small");
  parent.classList.add("error");
  small.innerText = messsage;
}

function showSuccess(input) {
  let parent = input.parentElement;
  let small = paren.querySelector("small");
  parent.classList.remove("error");
  small.innerText = "gygu";
}

showError(username, "loi");
