export function validateTaskTitle(title) {
  if (title.trim() === "") {
    return "Please enter a task.";
  }
  if (title.trim().length < 3) {
    return "Task must contain at least 3 characters.";
  }
  return null;
}
