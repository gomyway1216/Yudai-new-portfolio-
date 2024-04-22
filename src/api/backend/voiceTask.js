import { apiCall } from './backendConnector';

export const getResponse = async (body) => {
  try {
    const response = await fetch(process.env.REACT_APP_TASK_URL, {
      method: 'POST',
      body: body,
      headers: {
      },
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Function to get completed tasks
export const getCompletedTasks = async (userId) => {
  const tasks = await apiCall(process.env.REACT_APP_TASK_GET_COMPLETED_TASKS_URL, { user_id: userId });
  return tasks;
};

// Function to get incomplete tasks
export const getIncompleteTasks = async (userId) => {
  const tasks = await apiCall(process.env.REACT_APP_TASK_GET_INCOMPLETE_TASKS_URL, { user_id: userId });
  return tasks;
};

// Function to create a task
export const createTask = async (userId, taskData) => {
  const taskId = await apiCall(process.env.REACT_APP_TASK_CREATE_TASK_URL,
    { user_id: userId, task_data: JSON.stringify(taskData) });
  return taskId;
};

// Function to mark a task as completed
export const markTaskAsCompleted = async (userId, taskId) => {
  await apiCall(process.env.REACT_APP_TASK_MARK_TASK_AS_COMPLETED_URL, { user_id: userId, task_id: taskId });
};

// Function to mark a task as incomplete
export const markTaskAsIncomplete = async (userId, taskId) => {
  await apiCall(process.env.REACT_APP_TASK_MARK_TASK_AS_IMCOMPLETE_URL, { user_id: userId, task_id: taskId });
};

// Function to delete a task
export const deleteTask = async (userId, taskId) => {
  await apiCall(process.env.REACT_APP_TASK_DELETE_TASK_URL, { user_id: userId, task_id: taskId });
};

// Function to get all tasks
export const getAllTasks = async (userId) => {
  const tasks = await apiCall(process.env.REACT_APP_TASK_GET_ALL_TASKS_URL_LOCAL, { user_id: userId });
  return tasks;
};

// Function to get a task by ID
export const getTaskById = async (userId, taskId) => {
  const task = await apiCall(process.env.REACT_APP_TASK_GET_TASK_URL_LOCAL, { user_id: userId, task_id: taskId });
  return task;
};

// // Function to update a task name
// export const updateTaskName = async (userId, taskId, taskName) => {
//   await apiCall('update_task_name', { user_id: userId, task_id: taskId, task_name: taskName });
// };

// // Function to update a task
// export const updateTask = async (userId, taskId, taskData) => {
//   await apiCall('update_task', { user_id: userId, task_id: taskId, task_data: JSON.stringify(taskData) });
// };

// Function to create a task tag
export const createTaskTag = async (userId, tagName) => {
  await apiCall(process.env.REACT_APP_TASK_CREATE_TASK_TAG_URL_LOCAL, { user_id: userId, tag_name: tagName });
};

// Function to get all task tags
export const getAllTaskTags = async (userId) => {
  const tags = await apiCall(process.env.REACT_APP_TASK_GET_ALL_TASK_TAGS_URL_LOCAL, { user_id: userId });
  return tags;
};

// Function to create a task category
export const createTaskCategory = async (userId, categoryName) => {
  await apiCall(process.env.REACT_APP_TASK_CREATE_TASK_CATEGORY_URL_LOCAL,
    { user_id: userId, category_name: categoryName });
};

// Function to get all task categories
export const getAllTaskCategories = async (userId) => {
  const categories = await apiCall(process.env.REACT_APP_TASK_GET_ALL_TASK_CATEGORIES_URL_LOCAL, { user_id: userId });
  return categories;
};

// Function to create a task list
export const createTaskList = async (userId, listName) => {
  const listId = await apiCall(process.env.REACT_APP_TASK_CREATE_TASK_LIST_URL_LOCAL,
    { user_id: userId, list_name: listName });
  return listId;
};

// Function to get all task lists
export const getAllTaskLists = async (userId) => {
  console.log('userId', userId);
  const lists = await apiCall(process.env.REACT_APP_TASK_GET_ALL_TASK_LISTS_URL_LOCAL,
    { user_id: userId });
  console.log('received lists:', lists);
  return lists;
};

// Function to get tasks in a list
export const getTasksByList = async (userId, listId) => {
  const tasks = await apiCall(process.env.REACT_APP_TASK_GET_TASKS_BY_LIST_URL_LOCAL,
    { user_id: userId, list_id: listId });
  return tasks;
};
