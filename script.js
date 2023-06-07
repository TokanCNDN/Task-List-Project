const input = document.querySelector("#txtTaskName")
const clearBtn = document.querySelector("#btnClear")
const filters = document.querySelectorAll(".filters span")
const newTaskAddBtn=document.querySelector("#btnAddNewTask");
let taskList = [];
let editId;
let isEditTask = false;



if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"));
}
displayTasks("all");
//Enables listing and displaying the data on the screen.
function displayTasks(filter) {
    let ul = document.getElementById("task-list");

    if (taskList.length == 0) {//taskList is empty
        ul.innerHTML = "<p class'p-3 m-0'>Your task list is empty</p>"
    }
    else {
    //Always start by clearing the content of the <ul> element, and then dynamically display the list based on the selected status information.
        ul.innerHTML = "";

        for (let task of taskList) {
            let completed = task.status == "completed" ? "checked" : "";

            if (filter == task.status || filter == "all") {
                let li = `
                    <li class="task list-group-item" id="task${task.id}">
                        <div class="form-check">
                            <input type="checkbox" name="#" onclick="taskStatu(this)" id="${task.id}" class="form-check-input" ${completed}>
                            <label for="${task.id}" class="form-check-label ${completed}">${task.taskAdi}</label>
                        </div>
                        <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis"></i>
                        </button>
                            <ul class="dropdown-menu">
                                <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                                <li><a onclick='editTask(${task.id},"${task.taskAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                            </ul>
                        </div>
                    </li>`;
                ul.insertAdjacentHTML("beforeend", li);
            }
        }

    }
}

newTaskAddBtn.addEventListener("click", newTask)
newTaskAddBtn.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        document.getElementById("btnAddNewTask").click();
    }
});

for (const span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
    })
}


function taskStatu(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let status;
    if (selectedTask.checked) {
        label.classList.add("checked")
        status = "completed"
    }
    else {
        label.classList.remove("checked")
        status = "pending"
    }
    for (let task of taskList) {
        if (task.id == selectedTask.id) {
            task.status = status
        }
    }
    // taskList[selectedTask.id].status=status;
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

function newTask(event) {


    if (input.value != "") {
        if (!isEditTask) {
            //If the value of editTask is false, additions are made.
            //editTask değeri false ise ekleme yapar

            taskList.push({ id: taskList.length + 1, taskAdi: input.value, status: "pending" });
            input.value = "";

        }
        else {
            //If the value of editTask is true, it replaces the selected value with the inputted value. 
            //editTask değeri true ise seçili değeri inputa girilen değer ile değiştirir
            for (let task of taskList) {
                if (task.id == editId) {
                    task.taskAdi = input.value;
                    input.value = "";
                }
            }
        }
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
    else {
        alert("Task Is Not Null")
    }
    event.preventDefault();
}
function deleteTask(id) {
    let deletedId;
    for (let index in taskList) {
        if (taskList[index].id == id) { deletedId = index; }
    }
    taskList.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
}
function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    input.value = taskName;
    input.focus();
}
clearBtn.addEventListener("click", function () {
    taskList.splice(0, taskList.length)
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks("all");
    input.value = "";
})

