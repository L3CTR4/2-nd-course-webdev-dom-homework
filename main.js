"use strict";

const apiKey = "L3CTR4";
let firstLoading = true;

let nameInput = document.querySelector(".add-form-name");
let textInput = document.querySelector(".add-form-text");
let addCommentButton = document.getElementById("add-form-button");
let deleteCommentButton = document.getElementById("delete-form-button");

let comments = [];

renderComments();
getComments();

function renderComments() {
  console.log(comments);
  const commentsDiv = document.querySelector(".comments");

  if (firstLoading) {
    firstLoading = false;
    commentsDiv.innerHTML = `<div class="add-form"><p>Комментарии загружаются...</p></div>`;
    return;
  }

  commentsDiv.innerHTML = comments
    .map((comment, index) => {
      let date = new Date(comment.date);
      return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.author.name}</div>
          <div>${date.toLocaleString("ru-RU")}</div>
        </div>
        <div class="comment-body">
          ${
            comment.isEdit
              ? `<textarea class="comment-text -edit">${comment.text}</textarea>`
              : `<div class="comment-text">${quoteReplace(comment.text)}</div>`
          }
        </div>
        <div class="comment-footer">
          <button data-index="${index}" class='edit-comment-button'>${comment.isEdit ? `Сохранить` : `Редактировать`}
          </button>
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>`;
    })
    .join("");

  renderAddForm();

  document.querySelectorAll(".comment").forEach((comment) => {
    comment.addEventListener("click", () => {
      let index = comment.dataset.index;
      textInput.value = `QUOTE_BEGIN${comments[index].author.name}:QUOTE_NEW_LINE${comments[index].text}QUOTE_END`;
    });
  });

  document.querySelectorAll("textarea.comment-text").forEach((commentText) => {
    commentText.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  function delayLike(interval = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  }

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      button.classList.add(`-loading-like`);

      let index = button.dataset.index;
      let comment = comments[index];

      delayLike(2000).then(() => {
        comment.likes += comment.isLiked ? -1 : 1;
        comment.isLiked = !comment.isLiked;
        renderComments();
      });
    });
  });

  document.querySelectorAll(".edit-comment-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      let index = button.dataset.index;
      let comment = comments[index];
      if (comment.isEdit) {
        const newComment = button.closest(".comment").querySelector(".comment-text").value;
        comment.text = safeString(newComment);
      }
      comment.isEdit = !comment.isEdit;
      renderComments();
    });
  });
}

function renderAddForm(isLoading) {
  const addForm = document.querySelector(".add-form");

  if (isLoading) {
    addForm.innerHTML = `
    <p>Комментарий добавляется</p>
    `;
    return;
  }

  addForm.innerHTML = `
  <input type="text" class="add-form-name" placeholder="Введите ваше имя" />
  <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
  <div class="add-form-row">
    <button id="delete-form-button" class="add-form-button">Удалить последний комментарий</button>
    <button id="add-form-button" class="add-form-button">Написать</button>
  </div>
  `;

  nameInput = document.querySelector(".add-form-name");
  textInput = document.querySelector(".add-form-text");
  addCommentButton = document.getElementById("add-form-button");
  deleteCommentButton = document.getElementById("delete-form-button");

  addCommentButton.addEventListener("click", () => {
    let date = new Date().toLocaleString("ru-RU");
    addComment(nameInput.value, textInput.value);
    nameInput.value = "";
    textInput.value = "";
    isFillInputs(nameInput.value, textInput.value);
  });

  addForm.addEventListener("keyup", (event) => {
    if (event.key != "Enter" || !isFillInputs(nameInput.value, textInput.value)) return;
    let date = new Date().toLocaleString("ru-RU");
    addComment(nameInput.value, textInput.value, date);
    nameInput.value = "";
    textInput.value = "";
    isFillInputs(nameInput.value, textInput.value);
  });

  deleteCommentButton.addEventListener("click", () => {
    comments.pop();
    renderComments();
  });

  [nameInput, textInput].forEach((input) => {
    input.addEventListener("input", () => {
      isFillInputs(nameInput.value, textInput.value);
    });
  });
}

function isFillInputs(...inputs) {
  let isFill = inputs.length > 0;

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

function safeString(string) {
  return string.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function quoteReplace(string) {
  return string
    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
    .replaceAll("QUOTE_NEW_LINE", "<br>")
    .replaceAll("QUOTE_END", "</div>");
}

// API
function getComments() {
  fetch(`https://wedev-api.sky.pro/api/v1/${apiKey}/comments`, {
    method: `GET`,
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      comments = responseData.comments;
      renderComments();
      isFillInputs();
    });
}

function addComment(name, text) {
  renderAddForm(true);
  fetch(`https://wedev-api.sky.pro/api/v1/${apiKey}/comments`, {
    method: `POST`,
    body: JSON.stringify({
      name: safeString(name),
      text: safeString(text),
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      getComments();
    });
}
