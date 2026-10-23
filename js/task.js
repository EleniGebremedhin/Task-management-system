export function createTask(title, priority, category, deadline = "") {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    priority: priority,
    category: category,
    deadline: deadline,
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

export function updateTask(tasks, taskId, newTitle, newPriority) {
  return tasks.map(function (task) {
    if (task.id === taskId) {
      return {
        ...task,
        title: newTitle.trim(),
        priority: newPriority,
      };
    }

    return task;
  });
}
