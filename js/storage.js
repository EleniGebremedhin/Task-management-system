const STORAGE_KEY = "task-management-tasks";
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
export function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (savedTasks === null) {
    return [];
  }
  try {
    return JSON.parse(savedTasks);
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}
