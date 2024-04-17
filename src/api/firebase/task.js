import * as fbConnect from './firebaseConnect';
import {
  collection,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

const getDbAccess = () => {
  return fbConnect.exportDbAccess();
};

export const getTasks = async (userId) => {
  // Ensure a user ID is provided
  if (!userId) {
    throw new Error('No user ID provided');
  }

  // Access the nested 'task' collection inside the user's document
  const tasksCollectionPath = `user/${userId}/task`;
  const querySnapshot = await getDocs(collection(getDbAccess(), tasksCollectionPath));

  let tasks = [];
  querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });

  return tasks;
};

export const updateTaskCompletion = async (userId, taskId) => {
  // Ensure a user ID and task ID are provided
  if (!userId || !taskId) {
    throw new Error('No user ID or task ID provided');
  }

  // Access the nested 'task' collection inside the user's document
  const taskDocPath = `user/${userId}/task/${taskId}`;
  await updateDoc(doc(getDbAccess(), taskDocPath), {
    completed: true
  });
};