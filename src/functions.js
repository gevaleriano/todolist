const counter = document.getElementById('counter');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let currentFilter = "all";

//Filters
const filters = document.querySelectorAll('input[name="filter"]');

filters.forEach(filter => {
    filter.addEventListener("change", (e) => {
        currentFilter = e.target.value;
        renderTasks(); // o renderTasks() si quieres mostrar el loader
    });
});


export function saveTask(taskName){
    if (!taskName) 
        return alert('Please write something');
    tasks.push({id: Date.now(),name: taskName,status: "pending"});
    updateStorage(tasks);
    renderTasks();
}

export function renderTasks() {
    const containerLoader = document.getElementById("container-loader")
    const sortableList = document.getElementById("taskList")
    sortableList.classList.add("hide")
    containerLoader.classList.remove('hide')
    containerLoader.classList.add("loader")

    setTimeout(function() {
        sortableList.classList.remove('hide')
        containerLoader.classList.remove('loader')
        containerLoader.classList.add("hide")

        //tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        sortableList.innerHTML = '';
        
        tasks = getFilteredTasks();

        if (tasks.length < 1){
            sortableList.innerHTML = `
            <li class="empty-state">
                ${currentFilter !== "all"
                    ? "No matching tasks found."
                    : "Your task list is empty."}
            </li>`;

            counter.textContent = 0;
            return;
        }

        console.log(tasks)

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('task');
            li.dataset.id = task.id;
            li.classList.add(task.status);
            if(task.status != "canceled"){
                li.setAttribute('draggable', 'true');
                //Drag and Drop
                li.addEventListener("dragstart", () => {
                    setTimeout(() => li.classList.add("dragging"), 0);
                });
                li.addEventListener("dragend", () => {
                    li.classList.remove("dragging");
                });
            }
    
    
    
            //Details
            const Details = document.createElement('div');
            Details.classList.add("details")
    
            const span = document.createElement('span');
            span.innerText = task.name;
            li.appendChild(span);
    
            if(task.status != "completed"){
                const completeBtn = document.createElement('button');
                completeBtn.innerHTML = '<i class="ri-check-line"></i>';
                completeBtn.classList.add("btn-complete")
                completeBtn.onclick = () => updateStatus(task.id, "completed");
                Details.appendChild(completeBtn);
            }else{
                const completeBtn = document.createElement('button');
                completeBtn.innerHTML = '<i class="ri-reply-line"></i>';
                completeBtn.classList.add("btn-save")
                completeBtn.onclick = () => updateStatus(task.id, "pending");
                Details.appendChild(completeBtn);
            }
    
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="ri-edit-line"></i>';
            editBtn.classList.add("btn-edit")
            editBtn.onclick = () => enterEditMode(task.id, li);
            Details.appendChild(editBtn);
    
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
            deleteBtn.classList.add("btn-delete")
            deleteBtn.onclick = () => deleteTask(task.id);
            Details.appendChild(deleteBtn);
    
            const cancelBtn = document.createElement('button');
            cancelBtn.innerHTML = '<i class="ri-close-fill"></i>';
            cancelBtn.classList.add("btn-cancel")
            cancelBtn.onclick = () => updateStatus(task.id, "canceled");
            Details.appendChild(cancelBtn);
    
            li.appendChild(Details)

            if(task.status === "canceled"){
                Details.classList.add("show")
                cancelBtn.classList.add("hide")
            }
    
            sortableList.appendChild(li);
        });
        
        counter.innerHTML = tasks.filter(task => task.status === "pending").length

        
    }, 2000);
}


function deleteTask(id) {

    if (confirm("Delete this task?")) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
        tasks.splice(index, 1);
        updateStorage(tasks);
        renderTasks();
        }
    }
}
function updateStatus(id, newStatus){
    if (confirm(newStatus + " this item?")) {
        tasks = JSON.parse(localStorage.getItem("tasks")) || []
        const task = tasks.find(task => task.id === id)

        if(task){
            task.status = newStatus
            
            updateStorage(tasks);
            renderTasks();
        }
    }
}
/*
function completeTask(task) {
    task.status = "completed";
    updateStorage(tasks);
    renderTasks(tasks,list);
    alert("Task completed")
}

function cancelTask(tasks, task, list) {
    if (confirm("Cancel this item?")) {
        task.status = "canceled";
        updateStorage(tasks);
        renderTasks(tasks, list);
        alert("Task canceled")
    }
}
*/

function enterEditMode(id, li) {
    const task = tasks.find(task => task.id === id);

    li.innerHTML = '';

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = task.name;
    li.appendChild(inputEdit);

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Save';
    saveBtn.classList.add('btn-save')
    saveBtn.onclick = () => {
        const taskName = inputEdit.value.trim();
        
        if (taskName) {
            task.name = taskName;
            updateStorage(tasks);
            renderTasks();
        }
    };

    li.appendChild(saveBtn);

    inputEdit.addEventListener('keydown', (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            const taskName = inputEdit.value.trim();
            task.name = taskName
            updateStorage(tasks);
            renderTasks();
        }
    });
}


function updateStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//
export function updateTasksOrderFromDOM(list, tasks){
    const orderedIds = [...list.querySelectorAll("li")].map(li => Number(li.dataset.id));

    const mapaOrden = orderedIds.reduce((acc, id, index) => {
        acc[id] = index;
        return acc;
    }, {});

    tasks = tasks.toSorted((a, b) => {
        return mapaOrden[a.id] - mapaOrden[b.id];
    });
    updateStorage(tasks);
}

//filter tasks
function getFilteredTasks() {
    let filteredTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (currentFilter === "all") {
        return filteredTasks;
    }

    return filteredTasks.filter(task => task.status === currentFilter);
}

