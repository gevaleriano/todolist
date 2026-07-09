const counter = document.getElementById('counter');

export function saveTask(tasks, sortableList, taskName){
    if (!taskName) 
        return alert('Please write something');
    tasks.push({id: Date.now(),name: taskName,status: "pending"});
    updateStorage(tasks);
    renderTasks(tasks, sortableList);
}

export function renderTasks(list) {
    const tasks = JSON.parse(localStorage.getItem('tasks'))
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task');
        li.dataset.id = task.id;
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
            completeBtn.onclick = () => completeTask(tasks, task, list);
            Details.appendChild(completeBtn);
        }else if(task.status === "completed"){
            li.classList.add("completed")
        }
        if(task.status === "canceled"){
            li.classList.add("canceled")
        }

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="ri-edit-line"></i>';
        editBtn.classList.add("btn-edit")
        editBtn.onclick = () => enterEditMode(li, task, tasks, list);
        Details.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
        deleteBtn.classList.add("btn-delete")
        deleteBtn.onclick = () => deleteTask(tasks, task.id, list);
        Details.appendChild(deleteBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '<i class="ri-close-fill"></i>';
        cancelBtn.classList.add("btn-cancel")
        cancelBtn.onclick = () => cancelTask(tasks, task, list);
        Details.appendChild(cancelBtn);

        li.appendChild(Details)

        list.appendChild(li);
    });
    
    counter.innerHTML = tasks.filter(task => task.status === "pending").length
}


function deleteTask(tasks, id, list) {
    if (confirm("Delete this task?")) {
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
        tasks.splice(index, 1);
        updateStorage(tasks);
        renderTasks(tasks,list);
        }
    }
}

function completeTask(tasks, task,list) {
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

function enterEditMode(id) {
    const task = [].find(task => task.id === id);
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
            task.name = newTask;
            updateStorage(tasks);
            renderTasks(tasks, list);
        }
    };

    li.appendChild(saveBtn);

    inputEdit.addEventListener('keydown', (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            const taskName = inputEdit.value.trim();
            task.name = taskName
            inputEdit.value = ""
            updateStorage(tasks);
        renderTasks(tasks, list);
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
