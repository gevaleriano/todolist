
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.js'
import {renderTasks, updateTasksOrderFromDOM, saveTask} from "./functions.js";

let itemTasks = {};
const TasksLocalStorage = JSON.parse(localStorage.getItem('tasks')) || [];
const inputTodo = document.getElementById('inputTaskName');
const submit = document.getElementById('submit');
const sortableList = document.getElementById('taskList');




window.addEventListener('DOMContentLoaded', () => {
    renderTasks();

    
    itemTasks = sortableList.querySelectorAll(".task")
    itemTasks.forEach(taskItem => {

        taskItem.addEventListener("dragstart", () => {
            setTimeout(() => taskItem.classList.add("dragging"), 0);
        });
        taskItem.addEventListener("dragend", () => {
            taskItem.classList.remove("dragging");
            updateTasksOrderFromDOM(sortableList, tasks);
        });

    });
    


    const initSortableList = (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");

        if (!draggingItem) return;
        
        const siblings = [...sortableList.querySelectorAll(".task:not(.dragging)")];

        let nextSibling = siblings.find(sibling => {
            const siblingRect = sibling.getBoundingClientRect(); 
            return e.clientY <= siblingRect.top + (siblingRect.height / 2);
        });

        sortableList.insertBefore(draggingItem, nextSibling || null);
        
    }
    
    sortableList.addEventListener("dragover", initSortableList);
    sortableList.addEventListener("dragenter", e => e.preventDefault());
    
});


submit.addEventListener('click', () => {
    const taskName = inputTodo.value.trim();
    saveTask(taskName);
    inputTodo.value = ""
});

inputTodo.addEventListener('keydown', (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        const taskName = inputTodo.value.trim();
        saveTask(taskName)
        inputTodo.value = ""
    }
});


