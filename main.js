const tasks = [];
const iTodo = document.getElementById('iTodo');
const submit = document.getElementById('submit');
const list = document.getElementById('taskList');


class Todolist {
    constructor(id, todo, status) {
        this.id = id
        this.todo = todo
        this.status = status
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const newTask = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(...newTask);
    renderTasks();
});


submit.addEventListener('click', () => {
    const itodo = iTodo.value.trim();
    if (!itodo) 
        return alert('Please write something');
    const task = new Todolist (Date.now(), itodo, 1)
    tasks.push(task);
    iTodo.value = '';
    updateStorage();
    renderTasks();
});


function renderTasks() {
    list.innerHTML = '';
    tasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const span = document.createElement('span');
    span.innerText = task.todo;
    li.appendChild(span);

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.classList.add("btn-edit")
    editBtn.onclick = () => enterEditMode(li, task);
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add("btn-delete")
    deleteBtn.onclick = () => deleteTodo(task.id);
    li.appendChild(deleteBtn);

    list.appendChild(li);
    });
}


function deleteTodo(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
    tasks.splice(index, 1);
    updateStorage();
    renderTasks();
    }
}


function enterEditMode(li, task) {
    li.innerHTML = '';

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.classList.add()
    inputEdit.value = task.todo;
    li.appendChild(inputEdit);

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Save';
    saveBtn.classList.add('btn-save')
    saveBtn.onclick = () => {
    const newTask = inputEdit.value.trim();
    if (newTask) {
        task.todo = newTask;
        updateStorage();
        renderTasks();
    }
    };
    li.appendChild(saveBtn);
}


function updateStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
