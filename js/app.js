import { validateTaskTitle, validateTaskPriority } from "./validation.js";
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
const taskDeadline = document.querySelector("#task-deadline");
const taskCategory = document.querySelector("#task-category");
const themeToggle = document.querySelector("#theme-toggle");
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

    priority.className = `priority priority-${task.priority}`;

    priority.textContent = `${task.priority} priority`;
    const category = document.createElement("span");
    category.className = "task-category";
    category.textContent = task.category || "Other";
    const deadline = document.createElement("span");
    deadline.className = "task-deadline";

    if (task.deadline) {
      const dueDate = new Date(`${task.deadline}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formattedDate = dueDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      deadline.textContent = `Due: ${formattedDate}`;

      if (dueDate < today && !task.completed) {
        deadline.textContent = `Overdue: ${formattedDate}`;
        deadline.classList.add("overdue");
      }
    } else {
      deadline.textContent = "No deadline";
    }

    taskDetails.append(title, priority, category, deadline);
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
      const priorityError = validateTaskPriority(normalizedPriority);

      if (priorityError) {
        alert(priorityError);
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
  const priorityError = validateTaskPriority(taskPriority.value);

  if (priorityError) {
    alert(priorityError);
    return;
  }
  const newTask = createTask(
    title,
    taskPriority.value,
    taskCategory.value,
    taskDeadline.value,
  );
  tasks.push(newTask);

  saveTasks(tasks);
  taskForm.reset();
  taskPriority.value = "medium";
  taskCategory.value = "Study";
  taskDeadline.value = "";

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

/* Dark mode and theme preference */

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-mode", isDark);

  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

  themeToggle.setAttribute("aria-pressed", String(isDark));
}

const savedTheme = localStorage.getItem("task-management-system-theme");

applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", function () {
  const isDark = document.body.classList.contains("dark-mode");
  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem("task-management-system-theme", newTheme);
});
