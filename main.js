"use strict";

const addForm = document.querySelector(".add-form");
const nameInput = document.querySelector(".add-form-name");
const textInput = document.querySelector(".add-form-text");
const addCommentButton = document.getElementById("add-form-button");
const deleteCommentButton = document.getElementById("delete-form-button");

let comments = [
  {
    name: "Глеб Фокин",
    date: "12.02.22 12:18",
    comment: "Это будет первый комментарий на этой странице",
    likes: 3,
    isLiked: false,
    isEdit: false,
  },
  {
    name: "Варвара Н.",
    date: "13.02.22 19:22",
    comment: "Мне нравится как оформлена эта страница! ❤",
    likes: 75,
    isLiked: true,
    isEdit: false,
  },
];

renderComments();
isFillInputs();

function renderComments() {
  const commentsDiv = document.querySelector(".comments");

  commentsDiv.innerHTML = comments
    .map((comment, index) => {
      return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          ${
            comment.isEdit
              ? `<textarea class="comment-text -edit">${comment.comment}</textarea>`
              : `<div class="comment-text">${quoteReplace(comment.comment)}</div>`
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

  document.querySelectorAll(".comment").forEach((comment) => {
    comment.addEventListener("click", () => {
      let index = comment.dataset.index;
      textInput.value = `QUOTE_BEGIN${comments[index].name}:QUOTE_NEW_LINE${comments[index].comment}QUOTE_END`;
    });
  });

  document.querySelectorAll("textarea.comment-text").forEach((commentText) => {
    commentText.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });

  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      let index = button.dataset.index;
      let comment = comments[index];

      comment.likes += comment.isLiked ? -1 : 1;
      comment.isLiked = !comment.isLiked;

      renderComments();
    });
  });

  document.querySelectorAll(".edit-comment-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      let index = button.dataset.index;
      let comment = comments[index];
      if (comment.isEdit) {
        const newComment = button.closest(".comment").querySelector(".comment-text").value;
        comment.comment = safeString(newComment);
      }
      comment.isEdit = !comment.isEdit;
      renderComments();
    });
  });
}

addCommentButton.addEventListener("click", () => {
  let date = new Date().toLocaleString("ru-RU");
  addComment(nameInput.value, textInput.value, date);
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

function addComment(name, comment, date) {
  comments.push({
    name: safeString(name),
    comment: safeString(comment),
    date: date,
    likes: 0,
    isLiked: false,
    isEdit: false,
  });
  renderComments();
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
