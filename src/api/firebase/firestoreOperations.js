// Import necessary Firestore methods
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from './firebaseConnect'; // Import your Firebase app instance

const db = getFirestore(app);

// Function to add jobs to Firestore
export const addJobsToFirestore = async (jobs) => {
  const jobsCollection = collection(db, 'job');
  for (const job of jobs) {
    await addDoc(jobsCollection, job);
  }
};

// Function to add education to Firestore
export const addEducationToFirestore = async (education) => {
  const educationCollection = collection(db, 'education');
  for (const edu of education) {
    await addDoc(educationCollection, edu);
  }
};
// Function to read jobs from Firestore and return them as an array of objects
export const readJobFromFirestore = async () => {
  const jobsCollection = collection(db, 'job'); // Ensure this matches your collection name
  const querySnapshot = await getDocs(jobsCollection);
  const jobs = [];
  querySnapshot.forEach((doc) => {
    jobs.push({ id: doc.id, ...doc.data() });
  });
  return jobs; // Return an array of job objects
};

// Function to read education from Firestore and return them as an array of objects
export const readEducationFromFirestore = async () => {
  const educationCollection = collection(db, 'education'); 
  // Ensure this matches your collection name
  const querySnapshot = await getDocs(educationCollection);
  const education = [];
  querySnapshot.forEach((doc) => {
    education.push({ id: doc.id, ...doc.data() });
  });
  return education; // Return an array of education objects
};

// Similarly, you can add more functions as needed

// Function to add projects to Firestore
export const addProjectsToFirestore = async (projects) => {
  const projectsCollection = collection(db, 'project');
  for (const project of projects) {
    await addDoc(projectsCollection, project);
  }
};

// Function to read projects from Firestore and return them as an array of objects
export const readProjectsFromFirestore = async () => {
  const projectsCollection = collection(db, 'project');
  const querySnapshot = await getDocs(projectsCollection);
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  return projects; // Return an array of project objects
};