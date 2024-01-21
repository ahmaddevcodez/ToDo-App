const form = document.getElementById("form");
const submitBtn = document.getElementById("btn");
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const todoContainer = document.querySelector(".Todo");
const profilePic = document.querySelector(".profile-pic");
const inputFile = document.getElementById("input-file");

let data = [];
let editMode = false;

// Load data from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const storedData = localStorage.getItem("todos");
  if (storedData) {
    data = JSON.parse(storedData);
    ShowDataInDom();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputvalue1 = input1.value.trim();
  const inputvalue2 = input2.value.trim();

  if (inputvalue1.length > 0 && inputvalue2.length > 0) {
    if (!editMode) {
      const uuidString = uuid();
      const tempObj = {
        title: inputvalue1,
        description: inputvalue2,
        id: uuidString,
      };
      data.push(tempObj);
    } else {
      const id = input1.getAttribute("data-Id");
      data.forEach((todo) => {
        if (todo.id === id) {
          todo.title = inputvalue1;
          todo.description = inputvalue2;
        }
      });
      editMode = false;
      submitBtn.textContent = "Submit";
      input1.removeAttribute("data-Id");
    }

    // Save data to local storage
    localStorage.setItem("todos", JSON.stringify(data));

    ShowDataInDom();
    input1.value = "";
    input2.value = "";
  } else {
    alert("Please enter both fields");
  }
});
function uuid(mask = "xxxxxxxyx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
  return `${mask}`.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ShowDataInDom() {
  if (data.length === 0) {
    todoContainer.innerHTML = "No Todos Available";
  } else {
    let html = "";

    data.forEach((todo) => {
      const tempTodo = `
        <div class="Todo">
          <span id="Title">${todo.title}:</span>
          <span id="text">${todo.description}</span>
          <div id="actions">
            <i id="${todo.id}" onClick="edittodo(this)" class="edit fa-solid fa-pen-to-square"></i>
            <i data-delid="${todo.id}" onClick="deleteTodo(this)" class="delete fa-solid fa-trash-can"></i>
          </div>
        </div>
      `;
      html += tempTodo;
    });

    todoContainer.innerHTML = html;
  }
}

function edittodo(element) {
  const todo = data.find((t) => t.id === element.id);

  if (todo) {
    input1.value = todo.title;
    input2.value = todo.description;

    input1.setAttribute("data-Id", element.id);
    submitBtn.textContent = "Update";
    editMode = true;
  }
}

function deleteTodo(element) {
  const id = element.getAttribute("data-delid");
  data = data.filter((todo) => todo.id !== id);
  ShowDataInDom();
}
inputFile.addEventListener("change", function () {
  if (inputFile.files && inputFile.files[0]) {
    profilePic.src = URL.createObjectURL(inputFile.files[0]);
  }
});
