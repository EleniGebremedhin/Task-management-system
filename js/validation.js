export function validateTaskTitle(title) {
  if (typeof title !== "string" || title.trim() === "") {
    return "Please enter a task.";
  }

  if (title.trim().length < 3) {
    return "Task must contain at least 3 characters.";
  }

  return null;
}

export function validateTaskPriority(priority) {
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority)) {
    return "Priority must be low, medium, or high.";
  }

  return null;
}
