import { validateTaskTitle } from "./validation.js";
import {
  createTask,
  deleteTask,
  toggleTaskCompletion,
  updateTask,
} from "./task.js";
import { saveTasks, loadTasks } from "./storage.js";

let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskPriority = document.querySelector("#task-priority");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const searchInput = document.querySelector("#search-input");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");
const pendingCount = document.querySelector("#pending-count");

function renderTasks() {
  const searchText = searchInput.value.toLowerCase();

  const filteredTasks = tasks.filter(function (task) {
    const matchesSearch = task.title.toLowerCase().includes(searchText);

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  taskList.innerHTML = "";

  filteredTasks.forEach(function (task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    if (task.completed) {
      listItem.classList.add("completed");
    }

    const taskDetails = document.createElement("div");

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const priority = document.createElement("span");
    priority.className = "priority";
    priority.textContent = ` (${task.priority} priority)`;

    taskDetails.append(title, priority);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = task.completed ? "Undo" : "Complete";

    completeButton.addEventListener("click", function () {
      tasks = toggleTaskCompletion(tasks, task.id);
      saveTasks(tasks);
      renderTasks();
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function () {
      const newTitle = prompt("Enter the updated task title:", task.title);

      if (newTitle === null) {
        return;
      }

      const validationError = validateTaskTitle(newTitle);

      if (validationError) {
        alert(validationError);
        return;
      }

      const newPriority = prompt(
        "Enter priority: low, medium, or high",
        task.priority,
      );

      if (newPriority === null) {
        return;
      }

      const normalizedPriority = newPriority.trim().toLowerCase();

      if (!["low", "medium", "high"].includes(normalizedPriority)) {
        alert("Priority must be low, medium, or high.");
        return;
      }

      tasks = updateTask(tasks, task.id, newTitle, normalizedPriority);

      saveTasks(tasks);
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      tasks = deleteTask(tasks, task.id);
      saveTasks(tasks);
      renderTasks();
    });

    actions.append(completeButton, editButton, deleteButton);
    listItem.append(taskDetails, actions);
    taskList.append(listItem);
  });

  emptyMessage.hidden = filteredTasks.length > 0;
  emptyMessage.textContent =
    tasks.length === 0
      ? "No tasks yet. Add your first task!"
      : "No matching tasks found.";

  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter((task) => task.completed).length;
  pendingCount.textContent = tasks.filter((task) => !task.completed).length;
}

// Handle adding tasks
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskInput.value;
  const validationError = validateTaskTitle(title);

  if (validationError) {
    alert(validationError);
    return;
  }

  const newTask = createTask(title, taskPriority.value);
  tasks.push(newTask);

  saveTasks(tasks);
  taskForm.reset();
  taskPriority.value = "medium";

  renderTasks();
});

// Handle searching
searchInput.addEventListener("input", renderTasks);

// Handle filters
document.querySelectorAll("[data-filter]").forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// Display tasks when the page opens
renderTasks();
