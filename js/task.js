let nextTaskId = 1;
export function createTask(title, priority) {
  return {
    id: nextTaskId++,
    title: title.trim(),
    priority: priority,
    completed: false,
  };
}
export function deleteTask(tasks, taskId) {
  return tasks.filter(function (task) {
    return task.id !== taskId;
  });
}
export function toggleTaskCompletion(tasks, taskId) {
  return tasks.map(function (task) {
    if (task.id === taskId) {
      return {
        ...task,
        completed: !task.completed,
      };
    }
    return task;
  });
}
