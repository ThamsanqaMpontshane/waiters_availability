const success = document.querySelector(".success");
const error = document.querySelector(".error");
const pass = document.querySelector(".pass");
const theSuccess = document.querySelector(".theSuccess");
const thePass = document.querySelector(".thePass");

if (thePass) {
  thePass.style.display = "none";
  setTimeout(() => {
    theSuccess.style.display = "none";
    thePass.style.display = "flex";
  }, 4000);
}
const theNameInput = document.querySelector(".myinput");

setTimeout(() => {
  error.style.display = "none";
}, 3000);
setTimeout(() => {
  pass.style.display = "none";
}, 8000);
setTimeout(() => {
  success.style.display = "none";
}, 3000);
if (theNameInput.value !== "" && success?.innerHTML !== "") {
  setTimeout(() => {
    location.href = `/waiters/${theNameInput.value}`;
  }, 3000);
}
