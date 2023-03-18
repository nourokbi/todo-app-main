const createTodo = document.getElementById("create-todo");
const todos = document.getElementById("todos");
const state = document.getElementById ("state");
const states = document.querySelectorAll("#state p")
const clear = document.getElementById("clear")
const itemLeft = document.getElementById("items-left");
let checkBox = document.querySelectorAll(".check");
let todosItems = [];
if(localStorage.getItem("myTodos")){
  todosItems = JSON.parse(localStorage.getItem("myTodos"));
}
load(todosItems);

function load(todosItems) {
  todos.innerHTML = "";
  todosItems.forEach(element => {
    addTodo(element.content, element.state);
  });
  itemLeft.textContent = getActive(todosItems).length;
}

todos.addEventListener("click", (e) => {
  let parent = e.target.parentElement;
  if (
    parent.classList.contains("complete") ||
    parent.classList.contains("circle") ||
    parent.classList.contains("check")
  ) {
    if (parent.classList.contains("check")) {
      parent.parentElement.classList.toggle("checked");
    } else {
      parent.parentElement.parentElement.classList.toggle("checked");
    }
  }
  let todo = document.querySelectorAll(".todo");
  for(let i = 0; i < todo.length; i++) {
    if(todo[i].classList.contains("checked")) {
      todosItems[i].state = "checked";
    } else {
      todosItems[i].state = "";
    }
  }
  itemLeft.textContent = getActive(todosItems).length
  addToLocalStorage(todosItems);
});

function addTodo(todo, state = "") {
  todos.innerHTML += `
    <div class="todo ${state}">
          <div class="check" onselectstart="return false">
            <div class="circle"></div>
            <div class="complete">
              <img src="./images/icon-check.svg" alt="">
            </div>
          </div>
          <p>${todo}</p>
        </div>
    `;
}

document.body.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    if (createTodo.value.trim() != "") {
      addTodo(createTodo.value);
      newTodo = {
        content: createTodo.value, state: ""
      }
      todosItems.push(newTodo)
      addToLocalStorage(todosItems);
      createTodo.value = "";
      itemLeft.textContent = getActive(todosItems).length;
    }
  }
});

function addToLocalStorage(todosItems) {
  localStorage.setItem("myTodos", JSON.stringify(todosItems))
}

state.addEventListener("click", (e) => {
  // console.log(e.target);
  if(e.target.id != "state") {
    states.forEach(element => {
      element.classList.remove("active")
    })
    e.target.classList.add("active")
    if(e.target.previousElementSibling && e.target.previousElementSibling.previousElementSibling) {
      load(getCompleted(todosItems));
      itemLeft.textContent = getCompleted(todosItems).length;
    } else if(e.target.previousElementSibling) {
      load(getActive(todosItems));
    } else {
      load(todosItems);
    }
  }
})

function getCompleted(todos) {
  completedTodos = todos.filter(todo => todo.state == "checked")
  return completedTodos
}

function getActive(todos) {
  activeTodos = todos.filter((todo) => todo.state == "");
  return activeTodos;
}

clear.addEventListener("click", ()=> {
  todosItems = getActive(todosItems);
  load(todosItems);
  addToLocalStorage(todosItems);
})