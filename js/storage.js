const STORAGE_KEY = "task-management-system-tasks";

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Unable to save tasks. Please check your browser storage.");
    return false;
  }
}

export function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      console.error("Saved task data is not an array.");
      return [];
    }

    return parsedTasks;
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}
