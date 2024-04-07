"use strict";

const commentsDiv = document.querySelector(".comments");
const addForm = document.querySelector(".add-form");
const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addCommentButton = document.getElementById("add-form-button");
const deleteCommentButton = document.getElementById("delete-form-button");

isFillInputs(nameInput.value, textInput.value);

addCommentButton.addEventListener("click", () => {
  let date = new Date().toLocaleString('ru-RU');
  addComment(nameInput.value, textInput.value, date);
  nameInput.value = "";
  textInput.value = "";
  isFillInputs(nameInput.value, textInput.value);
});

addForm.addEventListener("keyup", (event) => {
  if (event.key != "Enter" || !isFillInputs(nameInput.value, textInput.value)) return;
  let date = new Date().toLocaleString('ru-RU');
  addComment(nameInput.value, textInput.value, date);
  nameInput.value = "";
  textInput.value = "";
  isFillInputs(nameInput.value, textInput.value);
});

deleteCommentButton.addEventListener("click", () => {
  var lastComment = commentsDiv.lastElementChild;
  if (lastComment !== null) {
    commentsDiv.removeChild(lastComment);
  }
});

[nameInput, textInput].forEach((input) => {
  input.addEventListener("input", () => {
    isFillInputs(nameInput.value, textInput.value);
  });
});

function isFillInputs(...inputs) {
  let isFill = true;

  let length = inputs.length;
  for (let i = 0; i < length; i++) {
    if (inputs[i].trim() === "") {
      isFill = false;
      break;
    }
  }

  if (isFill) {
    addCommentButton.classList.remove("-disabled");
    addCommentButton.disabled = false;
    return true;
  } else {
    addCommentButton.classList.add("-disabled");
    addCommentButton.disabled = true;
    return false;
  }
}

function addComment(name, comment, date) {
  commentsDiv.innerHTML =
  commentsDiv.innerHTML +
    `<li class="comment">
        <div class="comment-header">
            <div>${name}</div>
            <div>${date}</div>
        </div>
        <div class="comment-body">
            <div class="comment-text">${comment}</div>
        </div>
        <div class="comment-footer">
            <div class="likes">
                <span class="likes-counter">0</span>
                <button class="like-button"></button>
            </div>
        </div>
    </li>`;
}