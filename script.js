const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const searchInput = document.querySelector(".search-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoClick);
filterOption.addEventListener("change", filterTodo);
searchInput.addEventListener("input", searchTodo);


searchInput.addEventListener("focus", function() {
    todoButton.removeEventListener("click", addTodo); 
});


searchInput.addEventListener("blur", function() {
    todoButton.addEventListener("click", addTodo); 
});

function addTodo(event) {
    event.preventDefault();
    const todoDiv = document.createElement("div");
    const uniqueId = generateRandomTwoDigitId(); 
    todoDiv.dataset.id = uniqueId;
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = `${uniqueId} ${todoInput.value}`; 
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    
    saveLocalTodos(todoInput.value, uniqueId); 
    
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    
    todoList.appendChild(todoDiv);
    todoInput.value = "";
}

function handleTodoClick(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains("todo-item")) {
        const todoId = clickedElement.parentElement.dataset.id;
        const todoText = clickedElement.innerText.split(" ").slice(1).join(" "); 
        const newTodoText = prompt("Enter the new content:", todoText);
        if (newTodoText !== null) {
            updateTodoText(todoId, newTodoText); 
        }
    }
    if (clickedElement.classList.contains("trash-btn")) {
        const todo = clickedElement.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if (clickedElement.classList.contains("complete-btn")) {
        const todo = clickedElement.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(filterOption.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo, id) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({id, todo});
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todoObj) {
        const { id, todo } = todoObj;
        const todoDiv = document.createElement("div");
        todoDiv.dataset.id = id;
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.innerText = `${id} ${todo}`; 
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoId = todo.dataset.id;
    const index = todos.findIndex(item => item.id === parseInt(todoId));
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoText(id, newText) {
    const todo = document.querySelector(`[data-id="${id}"] .todo-item`);
    todo.innerText = `${id} ${newText}`; 
    updateLocalTodoText(id, newText);
}

function updateLocalTodoText(id, newText) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const index = todos.findIndex(item => item.id === parseInt(id));
    todos[index].todo = newText;
    localStorage.setItem("todos", JSON.stringify(todos));
}

function searchTodo() {
    const searchValue = searchInput.value.toLowerCase();
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        const todoId = todo.dataset.id;
        const todoText = todo.innerText.split(" ").slice(1).join(" "); 
        if (todoId.includes(searchValue)) {
            todo.style.display = "flex";
            todo.innerText = `${todoId} ${todoText}`; 
        } else {
            todo.style.display = "none";
        }
    });
}

function generateRandomTwoDigitId() {
    return Math.floor(Math.random() * 90) + 10;
}
